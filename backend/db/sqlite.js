const path = require('path');
const Database = require('better-sqlite3');

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    const dbPath = path.join(__dirname, 'lembaga.db');
    dbInstance = new Database(dbPath);
    dbInstance.pragma('foreign_keys = ON');
  }
  return dbInstance;
}

module.exports = { getDb };
