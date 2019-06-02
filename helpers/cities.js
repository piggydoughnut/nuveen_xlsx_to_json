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
    "x": "0",
    "y": "0"
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
  'name': 'A',
  'population':'B',
  'populationGrowth':'C',
  'population65':'D',
  'spendingGrowth':'E',
  'pixelLocation':'G'
  // x = G, y = H
}

const coords = {
  x: 'G',
  y: 'H'
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

const getPixelLocation = (sheet, excelIndex) => {
  return {
    x: sheet[coords['x'] + excelIndex].v + "",
    y: sheet[coords['y'] + excelIndex].v + ""
  }
}

/**
 * Creates a new element to insert in the cities json array
 * @param  {Object} map        field mapping from keys to excel row alphas
 * @param  {Number} excelIndex  row index
 * @param  {XLSX}   sheet       excel workbook
 * @return {Object}
 */
const formNewElement = (excelIndex, sheet) => {
  let copy = Object.assign({}, sample)
  for (let i in sample) {
    let value = sheet[colMapping[i] + excelIndex] ? sheet[colMapping[i] + excelIndex].v : null
    if (value && value !== '-') {
      if (i === 'pixelLocation' && sheet[coords['x']] && sheet[coords['y']]) {
        copy['pixelLocation'] = getPixelLocation(sheet, excelIndex)
      } else {
        copy[i] = value + ""
      }
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
  sheetName = sheetMap[sheetName]
  let jsonIdx = sheetMapping[sheetName].key
  let arrName = sheetMapping[sheetName].array
  for (let i in sample) {
    let value = sheet[colMapping[i] + xlsxIdx] ? sheet[colMapping[i] + xlsxIdx].v : null
    if (value && value !== '-') {
      if (i === 'pixelLocation' && sheet[coords['x']] && sheet[coords['y']]) {
          json[arrName][jsonIdx][sheetName][updIdx]['pixelLocation'] = getPixelLocation(sheet, excelIndex)
        } else {
          json[arrName][jsonIdx][sheetName][updIdx][i] = value + ""
        }

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
