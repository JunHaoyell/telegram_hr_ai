const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "../../hr.db")
);

// 初始化数据库
db.serialize(() => {
  // employees
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT UNIQUE,
      english_name TEXT,
      department TEXT,
      telegram_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // payroll
  db.run(`
    CREATE TABLE IF NOT EXISTS payroll (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT,
      month TEXT,
      basic_salary REAL,
      allowance REAL,
      overtime REAL,
      tax REAL,
      net_salary REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // otp
  db.run(`
    CREATE TABLE IF NOT EXISTS otp_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT,
      telegram_id TEXT,
      otp TEXT,
      expires_at DATETIME,
      used INTEGER DEFAULT 0
    )
  `);

  // demo数据（测试用）
  db.run(`
    INSERT OR IGNORE INTO employees (employee_id, english_name, department)
    VALUES ('EMP001', 'JOHN SMITH', 'HR')
  `);

  db.run(`
    INSERT OR IGNORE INTO payroll (
      employee_id, month, basic_salary, allowance, overtime, tax, net_salary
    )
    VALUES ('EMP001', '2026-06', 3000, 500, 200, 300, 3400)
  `);
});

module.exports = db;