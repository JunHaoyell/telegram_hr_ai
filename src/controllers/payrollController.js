const payrollService = require("../services/payrollService");

/**
 * =========================
 * 获取工资信息
 * =========================
 */
async function getPayroll(employee_id) {
  const data = await payrollService.getPayroll(employee_id);

  if (!data || data.length === 0) {
    return "暂无工资记录";
  }

  let msg = `💰 工资记录：\n\n`;

  data.forEach((item) => {
    msg += `📅 ${item.month}\n`;
    msg += `基本工资: ${item.basic_salary}\n`;
    msg += `补贴: ${item.allowance}\n`;
    msg += `加班: ${item.overtime}\n`;
    msg += `税: ${item.tax}\n`;
    msg += `实发: ${item.net_salary}\n\n`;
  });

  return msg;
}

module.exports = {
  getPayroll,
};