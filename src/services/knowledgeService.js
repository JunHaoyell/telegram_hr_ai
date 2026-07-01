const fs = require("fs");
const path = require("path");

const KNOWLEDGE_DIR = path.join(__dirname, "../../knowledge");

/**
 * 读取整个 knowledge 文件夹
 */
function loadKnowledge() {
  try {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      console.log("⚠️ Knowledge folder not found.");
      return "";
    }

    const files = fs
      .readdirSync(KNOWLEDGE_DIR)
      .filter((file) => file.endsWith(".md"));

    if (files.length === 0) {
      console.log("⚠️ No knowledge files found.");
      return "";
    }

    let knowledge = "";

    for (const file of files) {
      const filePath = path.join(KNOWLEDGE_DIR, file);

      const content = fs.readFileSync(filePath, "utf8");

      knowledge += `
==========================================================
文件：${file}
==========================================================

${content}

`;
    }

    console.log(`📚 Loaded ${files.length} knowledge files.`);

    return knowledge;
  } catch (err) {
    console.error("Knowledge Load Error:", err);
    return "";
  }
}

module.exports = {
  loadKnowledge,
};