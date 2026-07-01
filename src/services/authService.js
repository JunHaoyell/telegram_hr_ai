const otpService = require("./otpService");
const employeeModel = require("../db/employee.model");

/**
 * 查员工
 */
async function verifyEmployee(employee_id, english_name) {
  const employee = await employeeModel.findByEmployeeAndName(
    employee_id,
    english_name
  );

  if (!employee) {
    return { success: false };
  }

  return { success: true, employee };
}

/**
 * 生成 OTP + 决定发送目标
 */
async function generateOTP(employee, current_telegram_id) {
  const otp = otpService.generateOTP();

  // 如果已经绑定 → 发旧设备
  // 如果没绑定 → 发当前设备
  const targetTelegramId =
    employee.telegram_id || current_telegram_id;

  otpService.saveOTP(
    employee.employee_id,
    targetTelegramId,
    otp
  );

  return {
    otp,
    targetTelegramId,
  };
}

/**
 * 绑定 Telegram
 */
async function bindTelegram(employee_id, telegram_id) {
  return employeeModel.bindTelegram(employee_id, telegram_id);
}

module.exports = {
  verifyEmployee,
  generateOTP,
  bindTelegram,
};