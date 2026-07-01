const aiService = require("../services/aiService");
const payrollService = require("../services/payrollService");
const knowledgeService = require("../services/knowledgeService");

/**
 * ======================================
 * HR AI Controller
 * ======================================
 */
async function handleUserQuestion(employee, question) {
  try {
    /**
     * 1️⃣ 查询工资资料
     */
    const payroll = await payrollService.getPayroll(
      employee.employee_id
    );

    /**
     * 2️⃣ 读取整个知识库
     */
    const knowledge = knowledgeService.loadKnowledge();

    /**
     * Debug
     */
    console.log("=================================");
    console.log("Employee:");
    console.log(employee);

    console.log("=================================");
    console.log("Payroll:");
    console.log(payroll);

    console.log("=================================");
    console.log("=================================");
    console.log("Knowledge:");
    console.log(knowledge);
    console.log("=================================");

    console.log("=================================");
    console.log("Question:");
    console.log(question);

    /**
     * 3️⃣ AI回答
     */
    const answer = await aiService.askHR({
      employee,
      payroll,
      knowledge,
      question,
    });

    return answer;
  } catch (err) {
    console.error("AI Controller Error:", err);

    return "⚠️ 系统暂时无法回答，请稍后再试。";
  }
}

module.exports = {
  handleUserQuestion,
};