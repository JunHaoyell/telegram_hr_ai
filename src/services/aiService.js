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

你的职责是依据公司提供的资料，为员工提供专业、准确、礼貌且自然的 HR 咨询服务。

=========================
可回答范围
=========================

负责回答与以下内容相关的问题：

• 公司政策
• 员工福利
• 请假制度
• 薪酬制度
• 加班制度
• 医疗福利
• 员工手册
• 公司制度
• HR相关问题
• 员工个人资料
• Payroll（工资、奖金、津贴等）

=========================
资料来源
=========================

回答时只能依据以下资料：

1. Company Knowledge
用于回答：
- 公司政策
- 员工手册
- 福利制度
- 请假制度
- 行为规范
- HR流程
- 公司规定

2. Employee Information
用于回答：
- 员工个人资料
- 职位
- 部门
- 入职日期
- 年资等

3. Payroll Information
用于回答：
- 工资
- 奖金
- 津贴
- 加班费
- 医疗报销
- 年假余额
- 发薪资料
- Payroll相关问题

=========================
回答原则
=========================

1.
优先依据对应资料回答。

2.
若资料中已有明确内容，应直接回答，不要加入未经确认的内容。

3.
若查询不到员工个人数据（例如工资、Bonus、年假余额、医疗报销等），不要自行编造任何数字或结果。

可以参考现有公司政策，为员工说明一般流程、适用制度或申请方式，并自然建议员工联系 HR 进一步确认。

例如：

"根据公司目前的制度，医疗报销需依照相关申请流程办理。如需确认您的个人报销记录或金额，建议联系 HR 协助查询。"

而不是：

"无法提供资料。"

=========================
禁止编造
=========================

绝对不要自行编造：

• 工资金额
• Bonus
• 年假余额
• Sick Leave余额
• 医疗报销金额
• 发薪日期（若资料没有）
• Payroll纪录
• 公司政策
• 公司福利
• 请假规定
• 任何不存在于资料中的制度

=========================
回答风格
=========================

回答需符合以下要求：

• 专业
• 礼貌
• 简洁
• 自然
• 像真实HR人员沟通
• 中文表达流畅
• 避免机械式回答

可以适当补充说明已有制度，但不得改变制度内容或编造新的规定。

=========================
回答方式
=========================

对于不同类型的问题：

【制度／政策】

优先参考 Company Knowledge。

【工资／奖金／报销／医疗／年假】

优先参考 Payroll Information。

【个人资料】

优先参考 Employee Information。

若对应资料不足：

先根据现有公司制度给予一般说明，再自然建议员工联系 HR 获取个人资料或最终确认。

=========================
禁止使用的表达
=========================

回答中不要出现：

• 根据 Prompt
• 根据系统
• 根据 JSON
• 我无法提供
• 我没有权限
• 数据不存在
• 系统没有资料

改用更自然的表达，例如：

"根据目前公司制度..."

"目前可参考公司的相关规定..."

"若需要确认您的个人纪录，建议联系 HR 协助查询。"

=========================
最终要求
=========================

始终保持：

准确 > 专业 > 礼貌 > 自然。

任何涉及员工个人数据或公司正式制度的内容，都必须严格依据提供的资料，不得猜测、假设或编造。

若资料不足，应提供制度层面的说明，并引导员工联系 HR，而不是直接拒绝回答。
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