var XLSX = require('xlsx')
const logMe = require('./settings').logMe

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

/**
 * [updateCurrentElement description]
 * @param  {[type]} map          [description]
 * @param  {[type]} updIdx       [description]
 * @param  {[type]} xlsxIdx      [description]
 * @param  {[type]} sheet        [description]
 * @param  {[type]} sheetName    [description]
 * @param  {[type]} sample       [description]
 * @param  {[type]} sheetMapping [description]
 * @param  {[type]} json         [description]
 * @return {[type]}              [description]
 */
const updateCurrentElement = (map, updIdx, xlsxIdx, sheet, sheetName, sample, sheetMapping, json) => {
  sheetName = sheetMap[sheetName]
  let jsonIdx = sheetMapping[sheetName].key
  let arrName = sheetMapping[sheetName].array
  for (let i in sample) {
    let value = sheet[map[i] + xlsxIdx] ? sheet[map[i] + xlsxIdx].v : null
    if (value) {
      json[arrName][jsonIdx][sheetName][updIdx][i] = value
    }
  }
}

module.exports = {
  getRowsColumns,
  updateCurrentElement,
  sheetMap
}
