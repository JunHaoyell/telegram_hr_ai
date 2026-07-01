const db = require("./index");

const PayrollModel = {
  // 查某人所有工资记录
  findByEmployeeId(employee_id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM payroll WHERE employee_id = ? ORDER BY month DESC`,
        [employee_id],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  },

  // 查某个月工资
  findByMonth(employee_id, month) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM payroll WHERE employee_id = ? AND month = ?`,
        [employee_id, month],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  },

  // 添加工资记录（HR用）
  create(record) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO payroll 
        (employee_id, month, basic_salary, allowance, overtime, tax, net_salary)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          record.employee_id,
          record.month,
          record.basic_salary,
          record.allowance,
          record.overtime,
          record.tax,
          record.net_salary,
        ],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  },
};

module.exports = PayrollModel;