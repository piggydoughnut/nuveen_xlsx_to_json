const LOGGING = true
const logMe = (msg) => LOGGING ? console.log(msg) : null
const INPUT = './data/original.xlsx'
const OUTPUT = './data/updated.json'

module.exports = {
  logMe,
  INPUT,
  OUTPUT
}
