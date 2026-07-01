# 🤖 HR AI Telegram Bot

一个基于 **Node.js + Telegraf + SQLite + OpenAI + HR知识库** 的智能 HR 助手系统。

支持员工登录验证、OTP安全认证、工资查询以及 HR 政策 AI 问答。

---

# 🚀 功能介绍

## 👤 员工登录
- 工号 + 英文名验证
- 英文名统一 UPPERCASE 匹配
- 防止错误登录

---

## 🔐 OTP 验证
- 6位动态验证码
- 支持 Telegram 发送
- 已绑定账号优先发送历史设备
- 未绑定发送当前设备

---

## 📊 工资查询
- 直接读取 SQLite 数据库
- AI 不允许编造工资数据

---

## 📚 HR 知识库问答
支持：
- 薪酬制度
- 年假规则
- 病假制度
- 加班政策
- 考勤制度
- 报销制度
- 员工手册

---

## 🤖 AI 智能问答
- OpenAI GPT-4o-mini
- 结合 employee + payroll + knowledge
- HR 专业回答模式

---

# 🧠 系统流程


/start
↓
输入工号
↓
输入英文名（UPPERCASE匹配）
↓
发送 OTP
↓
OTP 验证
↓
登录成功
↓
HR AI 问答（工资 / 年假 / 政策）


---

# 📁 项目结构
- app.js
- hr.db
- .env

- src/
  - bot/
    - index.js

  - controllers/
    - authController.js
    - aiController.js

  - services/
    - authService.js
    - aiService.js
    - otpService.js
    - payrollService.js
    - knowledgeService.js

  - db/
    - index.js
    - employee.model.js
    - payroll.model.js

  - middleware/
    - authMiddleware.js

- knowledge/
  - 薪酬制度.md
  - 年假制度.md
  - 病假制度.md
  - 加班制度.md
  - 考勤制度.md
  - 员工手册.md
  - 医疗福利.md
  - 出差制度.md
  - 报销制度.md
  - 公司介绍.md
  - 常见问题FAQ.md
  - 行为准则.md

---

# ⚙️ 安装与运行

## 1️⃣ 安装依赖
```bash
npm install
2️⃣ 配置环境变量

创建 .env：

BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
3️⃣ 启动项目
npm start
🗄️ 数据库（SQLite）
employees 表
employee_id TEXT
english_name TEXT
telegram_id TEXT
payroll 表
employee_id TEXT
month TEXT
basic_salary REAL
allowance REAL
overtime REAL
tax REAL
net_salary REAL
otp_sessions 表
employee_id TEXT
telegram_id TEXT
otp TEXT
expires_at DATETIME
used INTEGER
🔐 安全规则
工资必须来自数据库
AI 不允许编造数据
OTP 必须验证
登录必须绑定 Telegram
英文名统一 UPPERCASE
📊 示例问题
工资查询
我的工资什么时候发？
年假
年假怎么算？
HR政策
报销流程是什么？
🤖 AI逻辑

AI 输入包含：

employee 信息
payroll 数据
knowledge HR 文档
🚀 后续可扩展
HR Web Dashboard
多公司支持
Redis Session
RAG知识库增强
AI HR Assistant SaaS
