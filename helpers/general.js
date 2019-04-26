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

const getAllCities = (workbook) => {
  let cityPopSheet = workbook.Sheets['City pop']
  let {nrows, ncols} = getRowsColumns(cityPopSheet)

  let exclude = ['Americas', 'Asia Pacific', 'Europe']
  let cities = []
  for (let i = 3; i < nrows + 1; i++) {
    let val = cityPopSheet['A' + i].v
    if (exclude.indexOf(val) === -1) {
      cities[val] = cityPopSheet['B' + i].v
    }
  }
  return cities
}

module.exports = {
  getRowsColumns,
  updateCurrentElement,
  sheetMap,
  getAllCities
}
