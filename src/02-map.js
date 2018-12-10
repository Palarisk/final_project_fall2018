import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 20, right: 20, bottom: 0 }

let height = 600 - margin.top - margin.bottom

let width = 800 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let projection = d3.geoNaturalEarth1()
// .rotate(rotate)
// .fitExtent([[1, 1], [width - 1, height - 1]], sphere)
// .precision(0.1)
// .translate([width / 2, height / 2])
// .scale(110)
let graticule = d3.geoGraticule()

// out geoPath needs a PROJECTION variable
let path = d3.geoPath().projection(projection)

var colorScale = d3.scaleSequential(d3.interpolateOrRd)

Promise.all([
  d3.json(require('./data/world.topojson')),
  d3.csv(require('./data/gift_2017.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, gifts]) {
  // console.log(json.objects)
  let countries = topojson.feature(json, json.objects.countries)
  // // console.log(countries)
  // console.log(gifts)
  colorScale.domain([0, 30000000])
  projection.fitSize([width, height], countries)
  var amountByName = {}

  gifts.forEach(function(d) {
    amountByName[d.name] = +d.amount
  })
  console.log(amountByName)

  svg
    .append('g')
    .attr('class', 'ocean')
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('d', path)
    .attr('fill', '#c3e4ff')

  svg
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', function(d) {
      if (!amountByName[d.properties.name]) {
        console.log(d.properties.name, 'has no data')
        return colorScale(0)
      }
      return colorScale(amountByName[d.properties.name])
    })
  // console.log(countries.features)

  // console.log(graticule())

  svg
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'white')
    .attr('stroke-width', 5)
    .lower()
}
