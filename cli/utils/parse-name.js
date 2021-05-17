/**
 *
 * @param {string} tmpName
 * 将变量名转换为大驼峰
 * @param basic-table
 * @returns ZdtBasicTable
 */
function parseName(tmpName) {
  const newName =
    tmpName[0].toUpperCase() +
    tmpName.slice(1).replace(/[-_\s]+(.)?/g, function(match, c) {
      return c ? c.toUpperCase() : "";
    });

  return `Zdt${newName}`;
}

module.exports = {
  parseName
};
