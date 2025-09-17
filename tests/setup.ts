import { beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = './test.db';

beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;
  process.env.SESSION_SECRET = 'test-secret';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.STRIPE_SECRET_KEY = 'sk_test_test-key';
  process.env.AIRTABLE_API_KEY = 'test-airtable-key';
});

beforeEach(() => {
  // Clean up test database before each test
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});

afterAll(() => {
  // Clean up test database after all tests
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});