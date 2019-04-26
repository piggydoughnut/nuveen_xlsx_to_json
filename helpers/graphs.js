
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

const readDataSheet = (sheet, tableKey, rows, cols) => {
  // console.log(sheet)
  let res = _.findKey(sheet, {v: tableKey})
  let number = res.match(/\d+/)[0]
  console.log('Looking for ' + tableKey + ', found at key' , number)
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
  // console.log(data)
  return data

}

module.exports = {
  readDataSheet
}
