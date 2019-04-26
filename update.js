
const graphs = require('./helpers/graphs')
const settings = require('./helpers/settings')
const currentJSON = require(settings.OUTPUT)
const gen = require('./helpers/general')
const fs = require('fs')
var XLSX = require('xlsx')

var workbook = XLSX.readFile(settings.INPUT)
const citiesSheetNames = ['Europe', 'Asia', 'Americas']
let areaMap = {}
citiesSheetNames.forEach((name, idx) => {
  let sheet = workbook.Sheets[name]
  const {nrows, ncols} = gen.getRowsColumns(sheet)
  for (let i = 2; i < nrows + 1; i ++) {
    let findBy = sheet['A' + i].v
    areaMap[findBy] = name
  }
})

/**
 * Save output to JSON
 */
const writetoJSON = () => {
  fs.writeFile(settings.OUTPUT, JSON.stringify(currentJSON), 'utf8', err => {
    err ? logMe(err) : null
    console.log('Done')
  })
}
console.log('Updating the series1Label values and series2Label values')
currentJSON['graphs'] =  currentJSON['graphs'].map((place, idx) => {
   place.graphGDPBreakdown.series1Label = place.name
   let label = graphs.labelMap[areaMap[place.name]]
   if (label) {
    place.graphGDPBreakdown.series2Label = label
   }
   return place
})


writetoJSON()
