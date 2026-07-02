const { Telegraf } = require("telegraf");

const authController = require("../controllers/authController");
const aiController = require("../controllers/aiController");

const {
  getSession,
  setSession,
  loginSuccess,
} = require("../middleware/authMiddleware");

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing in .env");
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

/**
 * /start
 */
bot.start(async (ctx) => {
  const telegram_id = ctx.from.id;

  setSession(telegram_id, {
    step: "EMPLOYEE_ID",
    isAuthenticated: false,
  });

  await ctx.reply("👋 欢迎使用 HR AI 系统");
  await ctx.reply("请输入你的工号：");
});

/**
 * 主逻辑
 */
bot.on("text", async (ctx) => {
  const telegram_id = ctx.from.id;
  const message = ctx.message.text;

  const session = getSession(telegram_id);

  try {
    /**
     * STEP 1
     */
    if (session.step === "EMPLOYEE_ID") {
      session.employee_id = message;
      session.step = "NAME";
      setSession(telegram_id, session);

      return ctx.reply("请输入英文名：");
    }

    /**
     * STEP 2
     */
    if (session.step === "NAME") {
      const result = await authController.verifyEmployee(
        session.employee_id,
        message.toUpperCase()
      );

      if (!result.success) {
        session.step = "EMPLOYEE_ID";
        setSession(telegram_id, session);

        return ctx.reply("❌ 工号或英文名错误，请重新 /start");
      }

      session.employee = result.employee;
      setSession(telegram_id, session);

      await authController.sendOTP(
        result.employee,
        telegram_id,
        bot
      );

      session.step = "OTP";
      setSession(telegram_id, session);

      return ctx.reply("📩 OTP已发送，请输入验证码：");
    }

    /**
     * STEP 3
     */
    if (session.step === "OTP") {
      const result = await authController.verifyOTP(
        session.employee.employee_id,
        message,
        telegram_id
      );

      if (!result.success) {
        return ctx.reply(result.message || "❌ OTP错误");
      }

      /**
       * 🔥 关键：绑定 Telegram
       */
      await authController.bindTelegram(
        session.employee.employee_id,
        telegram_id
      );

      loginSuccess(telegram_id, session.employee);

      session.step = "AUTHENTICATED";
      setSession(telegram_id, session);

      return ctx.reply(
        `✅ 登录成功\n欢迎 ${session.employee.english_name}`
      );
    }

    /**
     * STEP 4 AI
     */
    if (session.step === "AUTHENTICATED") {

      // 先提示用户
      await ctx.reply("🤔 AI 正在思考，请稍候...");

      // 调 AI
      const answer = await aiController.handleUserQuestion(
        session.employee,
        message
      );

      // 返回答案
      return ctx.reply(answer);
    }

    return ctx.reply("请使用 /start 开始");
  } catch (err) {
    console.error("BOT ERROR:", err);
    return ctx.reply("⚠️ 系统错误，请稍后再试");
  }
});

module.exports = bot;