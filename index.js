var fs = require('fs'), tempfile = require('tempfile')
var XLSX = require('xlsx')
const _ = require('lodash')
const ch = require('./helpers/cities')
const gen = require('./helpers/general')
const logMe = require('./helpers/settings').logMe
const settings = require('./helpers/settings')
const currentJSON = require(settings.ORIGINAL_JSON)
const graphs = require('./helpers/graphs')

var workbook = XLSX.readFile(settings.INPUT)

const citiesSheetNames = ['Europe', 'Asia', 'Americas']
// console.log(workbook.SheetNames)
// process.exit()
const processCities = () => {

  citiesSheetNames.forEach((name, idx) => {
    let jsonKey = gen.sheetMap[name]

    logMe('--------- --------- --------- ')
    logMe('Processing sheet name: ' + name)
    logMe('Corresponding key in the JSON file:' + jsonKey)


    let sheet = workbook.Sheets[name]
    const {nrows, ncols} = gen.getRowsColumns(sheet)
    logMe('Columns:' + ncols)
    logMe('Rows:' + nrows)

    for (let i = 2; i < nrows + 1; i ++) {
      logMe('****Processing row ' + i)

      let findBy = sheet['A' + i].v
      let indexInJson = ch.findInJSON(jsonKey, 'name', findBy, currentJSON)
      if (indexInJson === -1) {
        logMe('Element ' + findBy + ' does not exist')
        let elem = ch.formNewElement(ch.colMapping['cities'], i, sheet)
        let idx = ch.sheetMapping[jsonKey].key
        let arrName = ch.sheetMapping[jsonKey].array
        if (elem) {
          logMe('adding new element for ' + jsonKey + ' : ' + findBy)
          currentJSON[arrName][idx][jsonKey].push(elem)
        }
      } else {
        logMe('Element ' + findBy + 'found and will be updated')
        gen.updateCurrentElement(ch.colMapping['cities'], indexInJson, i, sheet, name, ch.cityObj, ch.sheetMapping, currentJSON)
      }
    }
  })
}

const processGDPGraph = (jsonTitle, sheet, lookFor, result) => {
  logMe(jsonTitle)
  let gIndex = getIndexGDPGrowth(jsonTitle, result)
  logMe('index', gIndex)
  let info = gen.getRowsColumns(sheet)
  logMe(info)
  let data = graphs.readDataSheet(sheet, lookFor, info.nrows, info.ncols)
  if (!data) {
    return
  }
  if (gIndex !== -1) {
    currentJSON['graphs'][result].graphGDPGrowth[gIndex].data  = data
  } else {
    logMe('--------- INSERTING')
    currentJSON['graphs'][result].graphGDPGrowth.push({
      data: data,
      name: jsonTitle
    })
  }
}

const processIncomeGraph = (sheet, lookFor, idx) => {
  let tableRowIndex = graphs.getTableKeyRowIndex(sheet, lookFor)
  let i = 2 // starts at C
  let data = {}
  let info = gen.getRowsColumns(sheet)
  while (i < info.ncols) {
    let alpha = graphs.numToAlpha(i)
    let value = sheet[alpha + tableRowIndex] ? sheet[alpha + tableRowIndex].v : null
    if (value) {
      let key = sheet[alpha + '2'].v
      if (!data[key]) {
        data[key] = []
      }
      data[key].push(value)
    }
    i++
  }
  currentJSON['graphs'][idx].graphIncome = data
}

const processGDPBreakdownGraph = (sheet, lookFor, idx) => {
  let tableRowIndex = graphs.getTableKeyRowIndex(sheet, lookFor)
  let i = 2 // starts at C
  let data = []
  let info = gen.getRowsColumns(sheet)
  while (i < info.ncols) {
    let alpha = graphs.numToAlpha(i)
    let value = sheet[alpha + tableRowIndex] ? sheet[alpha + tableRowIndex].v : null
    if (value) {
      let key = sheet[alpha + '2'].v
      data.push({
        name: key,
        y: value
      })
    }
    i++
  }
  currentJSON['graphs'][idx].graphGDPBreakdown.seriesData.push(data)
}

const processAgeGraph = (title, sheet, lookFor, idx) => {
  logMe(title)
  let info = gen.getRowsColumns(sheet)
  let data = graphs.readDataSheet(sheet, lookFor, info.nrows, info.ncols)
  if (!data) {
    return
  }
  currentJSON['graphs'][idx].graphAge.push(data)
}

/**
 * Retuns an index which refers to the position of the graph in the graphGDPGrowth array
 * @param  {String} name   name of the graph we are looking for
 * @param  {Number} result index of the city we are working with in the graphs array
 * @return {Number}        index in array
 */
let getIndexGDPGrowth = (name, result) => {
  return _.findIndex(currentJSON['graphs'][result].graphGDPGrowth, (obj) => obj.name.toLowerCase() === name.toLowerCase())
}
let sheets = {
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
const processGraphs = () => {


  let cityObj = gen.getAllCities(workbook)
  let cities = Object.keys(cityObj)
  let arrayName = 'graphs'

  cities.forEach(city => {
    logMe('city', city)
    let resIdx = _.findIndex(currentJSON['graphs'], {name: city})
    // the city is present in the list
    if (resIdx !== -1) {
      let country = cityObj[city]
      processAgeGraph('graphAgeCity', sheets.graphAgeCity, city, resIdx)
      processAgeGraph('graphAgeCountry', sheets.graphAgeCountry, country, resIdx)
      processGDPGraph('City Population', sheets.cityPopulation, city, resIdx)
      processGDPGraph('Country Population', sheets.countryPopulation, country, resIdx)
      processGDPGraph('Country GDP', sheets.countryGDP, country, resIdx)
      processGDPGraph('City GDP', sheets.cityGDP, city, resIdx)
      processGDPGraph('Country Retail Sales', sheets.countryRetailSales, country, resIdx)
      processGDPGraph('City Retail Sales', sheets.cityRetailSales, city, resIdx)
      processIncomeGraph(sheets.income, city, resIdx)

      currentJSON['graphs'][resIdx].graphGDPBreakdown.seriesData  = []
      processGDPBreakdownGraph(sheets.cityGDPBreakdown, city, resIdx)
      processGDPBreakdownGraph(sheets.countryGDPBreakdown, country, resIdx)
    }
  })
}

console.log('Lets parse')

processCities()
processGraphs()

var fs = require('fs');
fs.writeFile(settings.OUTPUT, JSON.stringify(currentJSON), 'utf8', err => {
  err ? logMe(err) : null
  console.log('Done')
})
