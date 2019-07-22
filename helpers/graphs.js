const XLSX = require('xlsx')
const _ = require('lodash')
const settings = require('./settings')
const workbook = XLSX.readFile(settings.INPUT)
const logMe = require('./settings').logMe

/**
 * Some countries or cities are named differently in different worksheet tabs
 */
const exceptions = {
  'Hong Kong': 'Hong Kong, China'
}

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

const labelMap = {
  'Europe': 'European cities average',
  'Americas': '',
  'Asia': 'Asia-Pacific cities average'
}

const sample = {
    name: "",
		graphAge: [],
		graphGDPGrowth: [{
			name: "City population",
			data: []
		}, {
			name: "City GDP",
			data: []
		}, {
			name: "City retail sales",
			data: []
		}, {
			name: "Country population",
			data: [],
			dashStyle: "solid"
		}, {
			name: "Country GDP",
			data: [],
			dashStyle: "solid"
		}, {
			name: "Country retail sales",
			data: [],
			dashStyle: "solid"
		}],
		graphIncome: [],
		graphGDPBreakdown: {
			series1Label: "",
			series2Label: "",
			seriesData: []
		}
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
 * Returns the index of the row for the given identifier
 * @param  {XLSX}   sheet    excel Worksheet
 * @param  {String} tableKey city or country name
 * @return {Number}          index
 */
const getTableKeyRowIndex = (sheet, tableKey) => {
  let res = _.findKey(sheet, {v: tableKey})
  if (!res && exceptions[tableKey]) {
    res = _.findKey(sheet, {v: exceptions[tableKey]})
  }
  if (res) {
    let number = res.match(/\d+/)[0]
    logMe('Looking for ' + tableKey + ', found at key ' + number)
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
 * Creates a new graph object
 * @param  {String} city name of the city
 * @return {Object}      copy of the sample object
 */
const makeNewGraphObject = (city) => {
  let copy = Object.assign({}, sample)
  copy.name = city.slice(0)
  return copy
}

module.exports = {
  readDataSheet,
  getTableKeyRowIndex,
  numToAlpha,
  sheets,
  getIndexGDPGrowth,
  makeNewGraphObject,
  labelMap
}
