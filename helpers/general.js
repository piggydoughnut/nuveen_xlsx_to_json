var XLSX = require('xlsx')

const sheetMap = {
  'Americas': 'america',
  'Asia': 'asia',
  'Europe': 'europe'
}
/**
 * Rows and columns for the given workSheet
 * @param  {[XLSX]}         sheet workSheet
 * @return {nrows, ncols}   rows and cols
 */
const getRowsColumns = (sheet) => {
  var range = XLSX.utils.decode_range(sheet['!ref']);
  const ncols = range.e.c - range.s.c + 1
  const nrows = range.e.r - range.s.r + 1;
  return {nrows, ncols}
}

const updateCurrentElement = (map, updIdx, xlsxIdx, sheet, sheetName, sample, sheetMapping, json) => {
  sheetName = sheetMap[sheetName]
  let jsonIdx = sheetMapping[sheetName].key
  let arrName = sheetMapping[sheetName].array
  // console.log('before---------')
  // console.log(currentJSON[arrName][jsonIdx][jsonKey][indexToUpdate])
  for (let i in sample) {
    let value = sheet[map[i] + xlsxIdx] ? sheet[map[i] + xlsxIdx].v : null
    if (value) {
      json[arrName][jsonIdx][sheetName][updIdx][i] = value
    }
  }
  // console.log('after----------')
  // console.log(currentJSON[arrName][jsonIdx][jsonKey][indexToUpdate])
}

module.exports = {
  getRowsColumns,
  updateCurrentElement,
  sheetMap
}
