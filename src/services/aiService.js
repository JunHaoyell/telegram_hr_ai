const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ===========================================
 * HR AI Service
 * ===========================================
 */
async function askHR({
  employee,
  payroll,
  knowledge,
  question,
}) {
  try {
    const systemPrompt = `
你是 ABC Technology 公司内部 HR AI 助手。

=========================
你的职责
=========================

负责回答：

1. 公司政策
2. 员工福利
3. 请假制度
4. 薪酬制度
5. 加班制度
6. 医疗福利
7. 员工手册
8. 公司制度
9. HR相关问题

=========================
回答规则
=========================

1.
公司政策只能依据提供的 Company Knowledge 回答。

2.
员工个人资料只能依据 Employee Information。

3.
工资只能依据 Payroll Information。

4.
如果资料不存在：

请回答：

"根据目前系统资料无法确认，请联系HR。"

不要猜测。

5.
绝对不能编造：

- 工资
- 年假余额
- Bonus
- 医疗福利
- 公司制度
- 发薪日期

6.
如果用户的问题属于：

工资

奖金

年假

医疗

报销

先参考 Payroll Information。

7.
如果用户的问题属于：

制度

政策

请假流程

员工手册

行为规范

先参考 Company Knowledge。

8.
回答要：

专业

礼貌

简洁

自然。

9.
不要告诉员工：

"根据Prompt"

"根据JSON"

"根据系统"

直接回答即可。
`;

    const userPrompt = `
=========================
Company Knowledge
=========================

${knowledge}

=========================
Employee Information
=========================

${JSON.stringify(employee, null, 2)}

=========================
Payroll Information
=========================

${JSON.stringify(payroll, null, 2)}

=========================
Employee Question
=========================

${question}
`;

    console.log("======================================");
    console.log("🤖 Sending Prompt to OpenAI...");
    console.log("Question:", question);

    const response =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

    const answer =
      response.choices[0].message.content;

    return answer;
  } catch (err) {
    console.error("OpenAI Error:", err);

    if (err.status === 401) {
      return "❌ OpenAI API Key 无效。";
    }

    if (err.status === 429) {
      return "⚠️ AI 服务额度不足或请求过于频繁，请稍后再试。";
    }

    return "⚠️ AI 服务暂时无法使用，请联系管理员。";
  }
}

module.exports = {
  askHR,
};