const LOGGING = true

module.exports = {
  logMe: (msg) => LOGGING ? console.log(msg) : null,
  INPUT: './data/updates.xlsx',
  OUTPUT: './data/updated.json',
  ORIGINAL_JSON: './data/original.json',
  GDPBREAKDOWN_MULTIPLY_BY_100: true
}
