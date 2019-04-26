var XLSX = require('xlsx')
const logMe = require('./settings').logMe

/**
 * Rows and columns for the given workSheet
 * @param  {[XLSX]}         sheet workSheet
 * @return {nrows, ncols}         rows and cols
 */
const getRowsColumns = (sheet) => {
  var range = XLSX.utils.decode_range(sheet['!ref']);
  const ncols = range.e.c - range.s.c + 1
  const nrows = range.e.r - range.s.r + 1;
  return {nrows, ncols}
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
  getAllCities
}
