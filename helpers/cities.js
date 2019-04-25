const _ = require('lodash')

const cityObj = {
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
 * [findInJSON description]
 * @param  {[type]} jsonKey [description]
 * @param  {[type]} field   [description]
 * @param  {[type]} value   [description]
 * @return {[type]}         [description]
 */
const findInJSON = (jsonKey, field, value, json) => {
console.log(jsonKey)
  let idx = sheetMapping[jsonKey].key
  let arrName = sheetMapping[jsonKey].array
  let searchArea = json[arrName][idx][jsonKey]

  console.log('(', jsonKey, ') Searching for', value, 'with field name', field)
  return _.findIndex(searchArea, (obj, idx) =>  obj[field].toLowerCase() === value.toLowerCase())
}

/**
 * [formNewElement description]
 * @param  {[type]} colMapping [description]
 * @param  {[type]} excelIndex [description]
 * @param  {[type]} sheet      [description]
 * @return {[type]}            [description]
 */
const formNewElement = (map, excelIndex, sheet) => {
  let copy = Object.assign({}, cityObj)
  for (let i in cityObj) {
    let val = sheet[map[i] + excelIndex]
    if (val) {
      if (val.v === '-') {
        console.log('Ignoring')
        return null
      }
      copy[i] = val.v
    } else {
      copy[i] = ""
    }
  }
  console.log(copy)
  return copy
}

module.exports = {
  cityObj,
  sheetMapping,
  colMapping,
  findInJSON,
  formNewElement
}
