const authService = require("../services/authService");
const otpService = require("../services/otpService");

/**
 * 验证员工
 */
async function verifyEmployee(employee_id, english_name) {
  return authService.verifyEmployee(employee_id, english_name);
}

/**
 * 发送 OTP（controller 负责发消息）
 */
async function sendOTP(employee, telegram_id, bot) {
  const result = await authService.generateOTP(
    employee,
    telegram_id
  );

  const { otp, targetTelegramId } = result;

  await bot.telegram.sendMessage(
    targetTelegramId,
    `🔐 OTP验证码：${otp}`
  );
}

/**
 * OTP验证
 */
async function verifyOTP(employee_id, otp, telegram_id) {
  const result = otpService.verifyOTP(
    employee_id,
    otp,
    telegram_id
  );

  return result;
}

/**
 * 绑定 Telegram
 */
async function bindTelegram(employee_id, telegram_id) {
  return authService.bindTelegram(employee_id, telegram_id);
}

module.exports = {
  verifyEmployee,
  sendOTP,
  verifyOTP,
  bindTelegram,
};