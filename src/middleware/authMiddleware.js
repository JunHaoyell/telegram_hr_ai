const Employee = require("../db/employee.model");

/**
 * =========================
 * 简单 session 存储（MVP版）
 * 后面可升级 Redis
 * =========================
 */
const sessions = new Map();

/**
 * 获取 session
 */
function getSession(telegram_id) {
  if (!sessions.has(telegram_id)) {
    sessions.set(telegram_id, {
      isAuthenticated: false,
      employee: null,
      step: "START",
    });
  }
  return sessions.get(telegram_id);
}

/**
 * 设置 session
 */
function setSession(telegram_id, data) {
  const current = getSession(telegram_id);
  sessions.set(telegram_id, {
    ...current,
    ...data,
  });
}

/**
 * =========================
 * 检查是否已登录
 * =========================
 */
function requireAuth() {
  return async (ctx, next) => {
    const telegram_id = ctx.from.id;

    const session = getSession(telegram_id);

    if (!session.isAuthenticated) {
      return ctx.reply("❌ 请先登录 /start");
    }

    ctx.session = session;
    return next();
  };
}

/**
 * =========================
 * 检查 Telegram 是否绑定员工
 * =========================
 */
async function checkTelegramBinding(telegram_id) {
  const employee = await Employee.findByTelegramId(telegram_id);

  return employee;
}

/**
 * =========================
 * 登录成功后绑定 session
 * =========================
 */
function loginSuccess(telegram_id, employee) {
  setSession(telegram_id, {
    isAuthenticated: true,
    employee,
    step: "AUTHENTICATED",
  });
}

/**
 * =========================
 * 登出
 * =========================
 */
function logout(telegram_id) {
  sessions.delete(telegram_id);
}

module.exports = {
  getSession,
  setSession,
  requireAuth,
  checkTelegramBinding,
  loginSuccess,
  logout,
};