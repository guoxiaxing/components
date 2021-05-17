const { writeContent, addComponent2Index } = require("./template-compile");
const { parseName } = require("./parse-name");

function createTsx(tsxPath, tsxTplPath, name) {
  const data = {
    componentName: parseName(name)
  };
  return writeContent(tsxTplPath, data, tsxPath);
}

function createMdx(mdxPath, mdxTplPath, name) {
  const data = {
    fileName: name
  };
  return writeContent(mdxTplPath, data, mdxPath);
}

function createService(servicePath, serviceTplPath, name) {
  const data = {
    serviceName: parseName(name)
  };
  return writeContent(serviceTplPath, data, servicePath);
}

function addExportInfo(indexPath, filePath) {
  console.log(indexPath, filePath, 555);
  return addComponent2Index(indexPath, filePath);
}

module.exports = {
  createMdx,
  createTsx,
  createService,
  addExportInfo
};
