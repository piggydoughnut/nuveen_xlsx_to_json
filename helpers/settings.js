const LOGGING = true

module.exports = {
  logMe: (msg) => LOGGING ? console.log(msg) : null,
  INPUT: './data/original.xlsx',
  OUTPUT: './data/updated.json',
  ORIGINAL_JSON: './data/original.json'
}
