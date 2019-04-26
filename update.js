
const graphs = require('./helpers/graphs')
const settings = require('./helpers/settings')
const currentJSON = require(settings.OUTPUT)
const fs = require('fs')

const areaMap = { Amsterdam: 'Europe',
  Ankara: 'Europe',
  Antwerp: 'Europe',
  Barcelona: 'Europe',
  Birmingham: 'Europe',
  Berlin: 'Europe',
  Bilbao: 'Europe',
  Bologna: 'Europe',
  Bordeaux: 'Europe',
  Bristol: 'Europe',
  Brussels: 'Europe',
  Bucharest: 'Europe',
  Budapest: 'Europe',
  Copenhagen: 'Europe',
  Dublin: 'Europe',
  Edinburgh: 'Europe',
  Frankfurt: 'Europe',
  Geneva: 'Europe',
  Gothenburg: 'Europe',
  Hamburg: 'Europe',
  Helsinki: 'Europe',
  Istanbul: 'Europe',
  Leeds: 'Europe',
  London: 'Europe',
  Luxembourg: 'Europe',
  Lyon: 'Europe',
  Madrid: 'Europe',
  Manchester: 'Europe',
  Milan: 'Europe',
  Munich: 'Europe',
  Oslo: 'Europe',
  Paris: 'Europe',
  Prague: 'Europe',
  Rome: 'Europe',
  Sofia: 'Europe',
  Stockholm: 'Europe',
  Stuttgart: 'Europe',
  'The Hague': 'Europe',
  Toulouse: 'Europe',
  Vienna: 'Europe',
  Warsaw: 'Europe',
  Zurich: 'Europe',
  Adelaide: 'Asia',
  Auckland: 'Asia',
  Beijing: 'Asia',
  Brisbane: 'Asia',
  Canberra: 'Asia',
  Guangzhou: 'Asia',
  'Hong Kong': 'Asia',
  Melbourne: 'Asia',
  Nagoya: 'Asia',
  Osaka: 'Asia',
  Perth: 'Asia',
  Seoul: 'Asia',
  Shanghai: 'Asia',
  Shenzhen: 'Asia',
  Singapore: 'Asia',
  Sydney: 'Asia',
  Tokyo: 'Asia',
  Austin: 'Americas',
  Boston: 'Americas',
  Charlotte: 'Americas',
  Chicago: 'Americas',
  Dallas: 'Americas',
  Denver: 'Americas',
  Honolulu: 'Americas',
  Houston: 'Americas',
  'Las Vegas': 'Americas',
  'Los Angeles': 'Americas',
  Miami: 'Americas',
  Minneapolis: 'Americas',
  Nashville: 'Americas',
  'New York': 'Americas',
  Orlando: 'Americas',
  Philadelphia: 'Americas',
  Phoenix: 'Americas',
  Portland: 'Americas',
  Riverside: 'Americas',
  Sacramento: 'Americas',
  'Salt Lake City': 'Americas',
  'San Antonio': 'Americas',
  'San Diego': 'Americas',
  'San Francisco': 'Americas',
  'San Jose': 'Americas',
  Seattle: 'Americas',
  Tampa: 'Americas',
  Toronto: 'Americas',
  Vancouver: 'Americas',
  Washington: 'Americas' }

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
  // console.log(place.name)
  // console.log(place.graphGDPBreakdown.series1Label)
   place.graphGDPBreakdown.series1Label = place.name
   let label = graphs.labelMap[areaMap[place.name]]
   if (label) {
    place.graphGDPBreakdown.series2Label = label
   }
   return place
})


writetoJSON()
