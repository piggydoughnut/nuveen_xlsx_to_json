var fs = require('fs'), tempfile = require('tempfile')
var XLSX = require('xlsx')
const currentJSON = require('./data/updated.json')
const _ = require('lodash')
const ch = require('./helpers/cities')
const gen = require('./helpers/general')
const logMe = require('./helpers/settings').logMe
const settings = require('./helpers/settings')

var workbook = XLSX.readFile(settings.INPUT)
// const sheetNames = workbook.SheetNames

const citiesSheetNames = ['Europe', 'Asia', 'Americas']

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
      logMe('***')
      logMe('Processing row ' + i)

      // for (let j in ch.colMapping['cities']) {
      //   let colLetter = ch.colMapping['cities'][j]
      //   logMe(colLetter + i, '(', j ,'):', sheet[colLetter + i].v)
      // }
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

const processGraphs = () => {

}

console.log('Lets parse')
processCities()

var fs = require('fs');
fs.writeFile(settings.OUTPUT, JSON.stringify(currentJSON), 'utf8', err => {
  err ? logMe(err) : null
  console.log('Done')
})
