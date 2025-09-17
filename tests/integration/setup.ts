import { beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import express from 'express';
import { registerRoutes } from '../../server/routes';

const TEST_DB_PATH = './integration-test.db';
let app: express.Application;
let server: any;

beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
  process.env.SESSION_SECRET = 'integration-test-secret';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.STRIPE_SECRET_KEY = 'sk_test_test-key';
  process.env.AIRTABLE_API_KEY = 'test-airtable-key';
  process.env.PORT = '3001';

  // Create Express app
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Register routes
  const httpServer = await registerRoutes(app);

  // Start test server
  server = httpServer.listen(3001);
});

beforeEach(() => {
  // Clean up test database before each test
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});

afterAll(async () => {
  // Close server and clean up
  if (server) {
    server.close();
  }
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});

export { app, server };