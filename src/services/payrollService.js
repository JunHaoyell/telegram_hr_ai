const Payroll = require("../db/payroll.model");

/**
 * 获取工资记录
 */
async function getPayroll(employee_id) {
  const data = await Payroll.findByEmployeeId(employee_id);
  return data;
}

/**
 * 获取某月工资
 */
async function getPayrollByMonth(employee_id, month) {
  const data = await Payroll.findByMonth(employee_id, month);
  return data;
}

module.exports = {
  getPayroll,
  getPayrollByMonth,
};