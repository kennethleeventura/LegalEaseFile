import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";

const IS_REPLIT = !!process.env.REPLIT_DOMAINS;

// ─── Dev-mode session (in-memory, no DB required) ────────────────────────────
function getDevSession() {
  return session({
    secret: process.env.SESSION_SECRET ?? "dev-secret-local",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
  });
}

// ─── Replit-mode session (postgres-backed) ────────────────────────────────────
async function getReplitSession() {
  const connectPg = (await import("connect-pg-simple")).default;
  const pgStore = connectPg(session);
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, maxAge: sessionTtl },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);

  if (!IS_REPLIT) {
    // ── Local dev: use in-memory sessions, attach a synthetic dev user ──────
    console.warn("[auth] REPLIT_DOMAINS not set — running in local dev mode. All requests treated as authenticated (dev user).");
    app.use(getDevSession());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));
    app.get("/api/login", (_req, res) => res.redirect("/"));
    app.get("/api/logout", (_req, res) => res.redirect("/"));
    app.get("/api/callback", (_req, res) => res.redirect("/"));
    return;
  }

  // ── Replit: full OIDC auth ─────────────────────────────────────────────────
  const { default: memoize } = await import("memoizee");
  const clientOidc = await import("openid-client");
  const { Strategy } = await import("openid-client/passport");
  const { storage } = await import("./storage");

  app.use(await getReplitSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const getOidcConfig = memoize(
    async () => clientOidc.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    ),
    { maxAge: 3600 * 1000 }
  );

  const config = await getOidcConfig();

  const verify = async (
    tokens: any,
    verified: passport.AuthenticateCallback
  ) => {
    const user: any = {};
    user.claims = tokens.claims();
    user.access_token = tokens.access_token;
    user.refresh_token = tokens.refresh_token;
    user.expires_at = user.claims?.exp;
    await storage.upsertUser({
      id: user.claims["sub"],
      email: user.claims["email"],
      firstName: user.claims["first_name"],
      lastName: user.claims["last_name"],
      profileImageUrl: user.claims["profile_image_url"],
    });
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    passport.use(new Strategy(
      { name: `replitauth:${domain}`, config, scope: "openid email profile offline_access", callbackURL: `https://${domain}/api/callback` },
      verify,
    ));
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, { prompt: "login consent", scope: ["openid", "email", "profile", "offline_access"] })(req, res, next);
  });
  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, { successReturnToOrRedirect: "/", failureRedirect: "/api/login" })(req, res, next);
  });
  app.get("/api/logout", async (req, res) => {
    req.logout(() => {
      res.redirect(clientOidc.buildEndSessionUrl(config, {
        client_id: process.env.REPL_ID!,
        post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
      }).href);
    });
  });
}

const DEV_USER = {
  claims: { sub: "dev-user", email: "dev@localhost" },
  expires_at: Math.floor(Date.now() / 1000) + 86400 * 365,
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Local dev: always pass through with a synthetic user
  if (!IS_REPLIT) {
    (req as any).user = DEV_USER;
    return next();
  }

  const user = req.user as any;
  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) return next();

  if (!user.refresh_token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const clientOidc = await import("openid-client");
    const memoize = (await import("memoizee")).default;
    const getOidcConfig = memoize(
      async () => clientOidc.discovery(new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"), process.env.REPL_ID!),
      { maxAge: 3600 * 1000 }
    );
    const config = await getOidcConfig();
    const tokenResponse = await clientOidc.refreshTokenGrant(config, user.refresh_token);
    user.claims = tokenResponse.claims();
    user.access_token = tokenResponse.access_token;
    user.refresh_token = tokenResponse.refresh_token;
    user.expires_at = user.claims?.exp;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};