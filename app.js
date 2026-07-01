require("dotenv").config();

console.log("1️⃣ app.js start");

const bot = require("./src/bot");

console.log("2️⃣ bot loaded");

bot.launch()
  .then(() => {
    console.log("🚀 BOT STARTED SUCCESSFULLY");
  })
  .catch((err) => {
    console.error("❌ BOT START ERROR:", err);
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));