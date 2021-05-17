const fs = require("fs");
const Handlebars = require("handlebars");
const chalk = require("chalk");

function writeContent(templatePath, dataObj, distFilePath) {
  console.log(templatePath, dataObj, distFilePath, 2222);
  return new Promise((resolve, reject) => {
    try {
      const source = fs.readFileSync(templatePath, "utf-8");
      const template = Handlebars.compile(source);
      Handlebars.registerHelper("raw-loud", options => options.fn());
      const content = template(dataObj);
      console.log(distFilePath, 233);
      fs.writeFileSync(distFilePath, content);
      console.log(chalk.green(`✔ ${distFilePath} 创建完成`));
      resolve();
    } catch (e) {
      console.log(chalk.red(e));
    }
  });
}

function addComponent2Index(indexPath, filePath) {
  return new Promise((resolve, reject) => {
    try {
      const source = fs.readFileSync(indexPath, "utf-8").split(/\n|\r|\r\n/gm);
      source.push(`export * from "./${filePath}"`);
      const content = source.join("\n");
      fs.writeFileSync(indexPath, content);
      console.log(chalk.green(`✔ ${indexPath} 写入完成`));
      resolve();
    } catch (e) {
      console.log(chalk.red(e));
    }
  });
}

module.exports = {
  writeContent,
  addComponent2Index
};
