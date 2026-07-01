// src/services/otpService.js

const crypto = require("crypto");

// 临时存储（生产建议换 Redis / DB）
const otpStore = {};

/**
 * 生成 6 位 OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 保存 OTP
 */
function saveOTP(employee_id, telegram_id, otp) {
  otpStore[employee_id] = {
    otp,
    telegram_id,
    expire: Date.now() + 5 * 60 * 1000, // 5分钟
  };
}

/**
 * 获取 OTP
 */
function getOTP(employee_id) {
  return otpStore[employee_id];
}

/**
 * 验证 OTP
 */
function verifyOTP(employee_id, inputOtp, telegram_id) {
  const record = otpStore[employee_id];

  if (!record) {
    return { success: false, message: "OTP不存在" };
  }

  if (Date.now() > record.expire) {
    delete otpStore[employee_id];
    return { success: false, message: "OTP已过期" };
  }

  if (record.otp !== inputOtp) {
    return { success: false, message: "OTP错误" };
  }

  // 验证成功
  delete otpStore[employee_id];

  return {
    success: true,
    telegram_id: record.telegram_id,
  };
}

module.exports = {
  generateOTP,
  saveOTP,
  getOTP,
  verifyOTP,
};