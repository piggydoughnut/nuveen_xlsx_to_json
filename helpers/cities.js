const _ = require('lodash')
const logMe = require('./settings').logMe

const sheetMap = {
  'Americas': 'america',
  'Asia': 'asia',
  'Europe': 'europe'
}

const sample = {
  "name": "",
  "marker": "",
  "video": "",
  "type": "",
  "pixelLocation":{
    "x": "",
    "y": ""
  },
  "population": "",
  "lifeScore": "",
  "technologyScore": "",
  "population65": "",
  "populationGrowth": "",
  "spendingGrowth": ""
}

const sheetMapping = {
  'europe': {
    array: 'cities',
    key: '0'
  },
  'america': {
    array: 'cities',
    key: '1'
  },
  'asia': {
    array: 'cities',
    key: '2'
  }
}

const colMapping = {
  'cities': {
    'name': 'A',
    'population':'B',
    'populationGrowth':'C',
    'population65':'D',
    'spendingGrowth':'E'
    // 'lifeScore':'8.5',
    // 'technologyScore':'10'
  }
}

/**
 * Looks for the value
 * @param  {String} jsonKey  object key for the given sheet
 * @param  {String} field    field name
 * @param  {String} value    field value
 * @return {Number}          index
 */
const findInJSON = (jsonKey, field, value, json) => {
  let idx = sheetMapping[jsonKey].key
  let arrName = sheetMapping[jsonKey].array
  let searchArea = json[arrName][idx][jsonKey]

  logMe('(' + jsonKey + ') Searching for ' + value + ' in the field ' + field)
  return _.findIndex(searchArea, (obj, idx) =>  obj[field].toLowerCase() === value.toLowerCase())
}

/**
 * Creates a new element to insert in the cities json array
 * @param  {Object} map        field mapping from keys to excel row alphas
 * @param  {Number} excelIndex  row index
 * @param  {XLSX}   sheet       excel workbook
 * @return {Object}
 */
const formNewElement = (map, excelIndex, sheet) => {
  let copy = Object.assign({}, sample)
  for (let i in sample) {
    let val = sheet[map[i] + excelIndex]
    if (val) {
      if (val.v === '-') {
        logMe('Ignoring')
        return null
      }
      copy[i] = val.v
    } else {
      copy[i] = ""
    }
  }
  return copy
}


/**
 * Update the given city element in json
 * @param  {Number} updIdx       index in the json array to update
 * @param  {Number} xlsxIdx      index in the excel sheet
 * @param  {XLSX}   sheet        xlsx worksheet
 * @param  {String} sheetName    name of the sheet
 * @param  {[type]} json         json file contents
 * @return
 */
const updateCurrentElement = (updIdx, xlsxIdx, sheet, sheetName, json) => {
  let map = colMapping['cities']
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

module.exports = {
  sheetMapping,
  colMapping,
  findInJSON,
  formNewElement,
  updateCurrentElement,
  sheetMap
}
