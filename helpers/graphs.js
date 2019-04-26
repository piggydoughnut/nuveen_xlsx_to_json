
var XLSX = require('xlsx')
const _ = require('lodash')

const map = {
  'City age structure':'graphAge'
}

const sheetMapping = {}

const colMapping = {}

const graphObject = {
  name: "",
  graphAge: [],
  graphGDPGrowth: [
    {
      name: "City population",
      data: []
    },
    {
      name: "City GDP",
      data: []
    },
    {
      name: "Country population",
      data: [],
      dashStyle: "solid"
    },
    {
      name: "Country GDP",
      data: [],
      dashStyle: "solid"
    },
    {
      name: "City retail sales",
      data: []
    },
    {
      name: "Country retail sales",
      data: [],
      dashStyle: "solid"
    }
  ],
  graphGDPBreakdown: {
    series1Label: "London",
    series2Label: "European cities average",
    seriesData: [
      {
       "name":"",
       "y":0
      }
    ]
  }
}

function numToAlpha(num) {

  var alpha = '';

  for (; num >= 0; num = parseInt(num / 26, 10) - 1) {
    alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
  }

  return alpha;
}

const exceptions = {
  'Hong Kong': 'Hong Kong, China'
}

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

module.exports = {
  readDataSheet,
  getTableKeyRowIndex,
  numToAlpha
}
