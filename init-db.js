import Database from 'better-sqlite3';

const dbPath = './local.db';
console.log('Initializing SQLite database at:', dbPath);

try {
  // Create database connection
  const sqlite = new Database(dbPath);
  
  // Create tables using SQL
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expire INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      email TEXT UNIQUE,
      first_name TEXT,
      last_name TEXT,
      profile_image_url TEXT,
      pacer_account_linked INTEGER DEFAULT 0,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_status TEXT DEFAULT 'inactive',
      subscription_tier TEXT DEFAULT 'free',
      subscription_start_date INTEGER,
      subscription_end_date INTEGER,
      created_at INTEGER DEFAULT (datetime('now')),
      updated_at INTEGER DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      user_id TEXT NOT NULL REFERENCES users(id),
      filename TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      content TEXT,
      document_type TEXT,
      ai_analysis TEXT,
      status TEXT NOT NULL DEFAULT 'uploaded',
      is_emergency INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (datetime('now')),
      updated_at INTEGER DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS document_templates (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      is_emergency INTEGER DEFAULT 0,
      template TEXT NOT NULL,
      estimated_time TEXT,
      created_at INTEGER DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS legal_aid_organizations (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      website TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      location TEXT NOT NULL,
      practice_areas TEXT NOT NULL,
      availability TEXT,
      is_emergency INTEGER DEFAULT 0,
      services_offered TEXT,
      eligibility_requirements TEXT,
      created_at INTEGER DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS filing_history (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      user_id TEXT NOT NULL REFERENCES users(id),
      document_id TEXT REFERENCES documents(id),
      filing_type TEXT NOT NULL,
      status TEXT NOT NULL,
      court_response TEXT,
      filed_at INTEGER,
      created_at INTEGER DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS subscription_plans (
      id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      yearly_price REAL,
      stripe_price_id TEXT,
      stripe_yearly_price_id TEXT,
      features TEXT NOT NULL,
      limits TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (datetime('now'))
    );
  `);
  
  console.log('✅ Database tables created successfully!');
  
  // Close the connection
  sqlite.close();
  
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}