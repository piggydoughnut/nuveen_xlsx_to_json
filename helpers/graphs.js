const XLSX = require('xlsx')
const _ = require('lodash')
const settings = require('./settings')
const workbook = XLSX.readFile(settings.INPUT)

const sheets = {
  graphAgeCity: workbook.Sheets['City age structure'],
  graphAgeCountry: workbook.Sheets['Country age structure'],
  cityPopulation: workbook.Sheets['City pop'],
  countryPopulation: workbook.Sheets['Country pop'],
  countryGDP: workbook.Sheets['Country GDP'],
  cityGDP: workbook.Sheets['City GDP'],
  cityRetailSales: workbook.Sheets['City retail '],
  countryRetailSales: workbook.Sheets['Country retail'],
  income: workbook.Sheets['Distribution of income'],
  cityGDPBreakdown: workbook.Sheets['City GDP breakdown'],
  countryGDPBreakdown: workbook.Sheets['Country GDP breakdown']
}

/**
 * Converts number to an alpha value
 * @param  {Number} num
 * @return {String}
 */
const numToAlpha = (num) => {
  let alpha = ''
  for (; num >= 0; num = parseInt(num / 26, 10) - 1) {
    alpha = String.fromCharCode(num % 26 + 0x41) + alpha
  }
  return alpha
}

/**
 * Some countries or cities are named differently in different worksheet tabs
 */
const exceptions = {
  'Hong Kong': 'Hong Kong, China'
}

/**
 * Returns the index of the row for the given identified
 * @param  {XLSX}   sheet    excel Worksheet
 * @param  {String} tableKey city or country name
 * @return {Number}          index
 */
const getTableKeyRowIndex = (sheet, tableKey) => {
  console.log(tableKey)
  let res = _.findKey(sheet, {v: tableKey})
  if (!res && exceptions[tableKey]) {
    res = _.findKey(sheet, {v: exceptions[tableKey]})
  }
  if (res) {
    let number = res.match(/\d+/)[0]
    console.log('Looking for ' + tableKey + ', found at key' , number)
    return number
  }
  return null
}

/**
 * Reads the data values in a row
 * @param  {XLSX}     sheet      excel Worksheet
 * @param  {String}   tableKey   city or country name
 * @param  {Number}   rows       number of rows
 * @param  {Number}   cols       number of columns
 * @return {[Number]}
 */
const readDataSheet = (sheet, tableKey, rows, cols) => {
  let number = getTableKeyRowIndex(sheet, tableKey)
  if (!number) {
    return null
  }
  let i = 2 // starts at C
  let data = []
  while (i < cols) {
    let alpha = numToAlpha(i)
    let value = sheet[alpha + number] ? sheet[alpha + number].v : null
    if (value) {
      data.push(value)
    }
    i++
  }
  return data
}

/**
 * Retuns an index which refers to the position of the graph in the graphGDPGrowth array
 * @param  {String} name   name of the graph we are looking for
 * @param  {Number} result index of the city we are working with in the graphs array
 * @return {Number}        index in array
 */
const getIndexGDPGrowth = (name, result, json) => {
  return _.findIndex(json['graphs'][result].graphGDPGrowth, (obj) => obj.name.toLowerCase() === name.toLowerCase())
}

module.exports = {
  readDataSheet,
  getTableKeyRowIndex,
  numToAlpha,
  sheets,
  getIndexGDPGrowth
}
