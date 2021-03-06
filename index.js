const fs = require('fs')
var XLSX = require('xlsx')
const _ = require('lodash')
const ch = require('./helpers/cities')
const gen = require('./helpers/general')
const logMe = require('./helpers/settings').logMe
const settings = require('./helpers/settings')
const graphs = require('./helpers/graphs')

let newCities = []

const currentJSON = require(settings.ORIGINAL_JSON)
const workbook = XLSX.readFile(settings.INPUT)
const citiesSheetNames = ['Europe', 'Asia', 'Americas']
let areaMap = {}

/**
 * Gets data for the GDP graph
 * @param  {String} jsonTitle graph title in json, key
 * @param  {XLSX}   sheet     work sheet
 * @param  {String} lookFor   city or country we are filling in for
 * @param  {Number} result    index in the graphs json array
 * @return {[type]}
 */
const processYearNumberGraph = (jsonTitle, sheet, lookFor, result) => {
  logMe('---')
  logMe('Processing ' + jsonTitle + ' Graph for ' + lookFor)
  let info = gen.getRowsColumns(sheet)

  let data = Object.assign({}, graphs.readDataSheet(sheet, lookFor, info.nrows, info.ncols))
  if (!data) {
    return
  }
  logMe('Adding a graph of type ' + jsonTitle + ' to the GDPGrowth array')
  currentJSON['graphs'][result].graphGDPGrowth.push({
    name: jsonTitle,
    data: data
  })
}

/**
 * gets and sets data for the Income graph
 * @param  {XLSX}   sheet   worksheet
 * @param  {String} lookFor city or country to look for
 * @param  {Number} idx     graph array idx
 * @return
 */
const processIncomeGraph = (sheet, lookFor, idx) => {
  logMe('---')
  logMe('Processing Income Graph for ' + lookFor)
  let tableRowIndex = graphs.getTableKeyRowIndex(sheet, lookFor)
  let info = gen.getRowsColumns(sheet)
  let i = info.ncols // starts at C
  let data = {}
  while (i > 1) {
    let alpha = graphs.numToAlpha(i)
    let value = sheet[alpha + tableRowIndex] ? sheet[alpha + tableRowIndex].v : null
    if (value) {
      let key = sheet[alpha + '2'].v
      if (!data[key]) {
        data[key] = []
      }
      data[key].push(value)
    }
    i--
  }
  let result = []
  for (let k in data) {
    result.push({
      name: k,
      data: data[k]
    })
  }
  currentJSON['graphs'][idx].graphIncome = result
}

/**
 * Process the GDP breakdown graphs
 * @param  {XLSX}   sheet   worksheet
 * @param  {String} lookFor city or country
 * @param  {Number} idx     index in the graphs array
 * @return
 */
const processGDPBreakdownGraph = (sheet, lookFor, idx) => {
  logMe('---')
  logMe('Processing GDP Breakdown Graph for ' + lookFor)

  let tableRowIndex = graphs.getTableKeyRowIndex(sheet, lookFor)
  let i = 2 // starts at C
  let data = []
  let info = gen.getRowsColumns(sheet)

  while (i < info.ncols) {
    let alpha = graphs.numToAlpha(i)
    let value = sheet[alpha + tableRowIndex] ? sheet[alpha + tableRowIndex].v : null
    if (value) {
      let key = sheet[alpha + '2'].v
      if (settings.GDPBREAKDOWN_MULTIPLY_BY_100) {
          value =  Math.round( (value * 100) * 10 ) / 10;
      }
      data.push({
        name: key,
        y: value
      })
    }
    i++
  }

  if (currentJSON['graphs'][idx].graphGDPBreakdown.seriesData.length === 0) {
    currentJSON['graphs'][idx].graphGDPBreakdown = {
      series1Label: lookFor.slice(0),
      seriesData: []
    }
    let label = graphs.labelMap[areaMap[lookFor]]
    if (label) {
      currentJSON['graphs'][idx].graphGDPBreakdown.series2Label = label
    }
  }
  currentJSON['graphs'][idx].graphGDPBreakdown.seriesData.push(data)
}

/**
 * process the age graphs
 * @param  {String} title   graph title, json key
 * @param  {XLSX}   sheet   worksheet
 * @param  {String} lookFor city or country
 * @param  {Number} idx     index in the graphs array
 * @return
 */
const processAgeGraph = (title, sheet, lookFor, idx) => {
  logMe('---')
  logMe('Processing Age Graph for ' + lookFor)
  let info = gen.getRowsColumns(sheet)
  let data = graphs.readDataSheet(sheet, lookFor, info.nrows, info.ncols)
  if (!data) {
    return
  }
  currentJSON['graphs'][idx].graphAge.push({
    name: lookFor,
    data: data
  })
}

/**
 * process Graphs
 */
const processGraphs = () => {
  let cityObj = gen.getAllCities(workbook)
  let cities = Object.keys(cityObj)
  let arrayName = 'graphs'

  cities.forEach(city => {
    let resIdx = _.findIndex(currentJSON['graphs'], {name: city})
    // the city is present in the list
    if (resIdx !== -1) {
      let country = cityObj[city]
      logMe("\n")
      logMe('***************************** ')
      logMe('Processing city ' + city + ' and country ' + country)
      currentJSON['graphs'][resIdx].graphAge = []
      processAgeGraph('graphAgeCity', graphs.sheets.graphAgeCity, city, resIdx)
      processAgeGraph('graphAgeCountry', graphs.sheets.graphAgeCountry, country, resIdx)
      currentJSON['graphs'][resIdx].graphGDPGrowth = []
      processYearNumberGraph('City Population', graphs.sheets.cityPopulation, city, resIdx)
      processYearNumberGraph('Country Population', graphs.sheets.countryPopulation, country, resIdx)
      processYearNumberGraph('Country GDP', graphs.sheets.countryGDP, country, resIdx)
      processYearNumberGraph('City GDP', graphs.sheets.cityGDP, city, resIdx)
      processYearNumberGraph('Country Retail Sales', graphs.sheets.countryRetailSales, country, resIdx)
      processYearNumberGraph('City Retail Sales', graphs.sheets.cityRetailSales, city, resIdx)
      processIncomeGraph(graphs.sheets.income, city, resIdx)

      currentJSON['graphs'][resIdx].graphGDPBreakdown.series1Label = city
      currentJSON['graphs'][resIdx].graphGDPBreakdown.seriesData  = []
      processGDPBreakdownGraph(graphs.sheets.cityGDPBreakdown, city, resIdx)
      processGDPBreakdownGraph(graphs.sheets.countryGDPBreakdown, country, resIdx)
    }
  })
}

/**
 * Process Cities
 */
const processCities = () => {

  citiesSheetNames.forEach((name, idx) => {
    let jsonKey = ch.sheetMap[name]

    logMe('--------- --------- --------- ')
    logMe('Processing sheet name: ' + name)
    logMe('Corresponding key in the JSON file:' + jsonKey)

    let sheet = workbook.Sheets[name]
    const {nrows, ncols} = gen.getRowsColumns(sheet)
    logMe('Columns:' + ncols)
    logMe('Rows:' + nrows)

    for (let i = 2; i < nrows + 1; i ++) {
      logMe("\n")
      logMe('*****************************')

      let findBy = sheet['A' + i].v
      areaMap[findBy] = name
      logMe('Processing ' + findBy + ' on the row ' + i)
      let indexInJson = ch.findInJSON(jsonKey, 'name', findBy, currentJSON)
      if (indexInJson === -1) {
        logMe('Element ' + findBy + ' does not exist')
        let elem = ch.formNewElement(i, sheet)
        let idx = ch.sheetMapping[jsonKey].key
        let arrName = ch.sheetMapping[jsonKey].array
        if (elem) {
          newCities.push(findBy)
          logMe('adding new element for ' + jsonKey + ' : ' + findBy)
          currentJSON[arrName][idx][jsonKey].push(elem)
          let obj = graphs.makeNewGraphObject(findBy)
          currentJSON['graphs'].push({...obj})
        }
      } else {
        logMe('Element ' + findBy + 'found and will be updated')
        ch.updateCurrentElement(indexInJson, i, sheet, name, currentJSON)
      }
    }
  })
}

/**
 * Save output to JSON
 */
const writetoJSON = () => {
  fs.writeFile(settings.OUTPUT, JSON.stringify(currentJSON), 'utf8', err => {
    err ? logMe(err) : null
  })
}

console.log('Lets parse')
processCities()
processGraphs()
writetoJSON()

console.log("\n\n\n")
console.log('----Added new cities-----')
console.log(newCities)
