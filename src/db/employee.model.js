const db = require("./index");

const EmployeeModel = {
  // 查员工（登录用）
  findByEmployeeAndName(employee_id, english_name) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM employees WHERE employee_id = ? AND english_name = ?`,
        [employee_id, english_name],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  },

  // 查员工（by ID）
  findById(employee_id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM employees WHERE employee_id = ?`,
        [employee_id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  },

  // 绑定 Telegram
  bindTelegram(employee_id, telegram_id) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE employees SET telegram_id = ? WHERE employee_id = ?`,
        [telegram_id, employee_id],
        function (err) {
          if (err) reject(err);
          resolve(true);
        }
      );
    });
  },

  // 查 Telegram 是否已绑定
  findByTelegramId(telegram_id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM employees WHERE telegram_id = ?`,
        [telegram_id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  },
};

module.exports = EmployeeModel;