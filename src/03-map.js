import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 250, left: 65, right: 30, bottom: 30 }

var height = 500 - margin.top - margin.bottom

var width = 300 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales

  var xPositionScale = d3.scaleBand()
  //.domain([2012, 2013, 2014, 2015, 2016, 2017])
  .range([0, width])

  var heightScale = d3
    .scaleLinear()
    .domain([0, 300000000])
    .range([height, 0])


// Read in your data

Promise.all([
  d3.csv(require('./data/gift_data_2012_2017.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function

function ready([datapoints]) {
  

  var years = datapoints.map(d => d.year)
  xPositionScale.domain(years)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.Country
    })
    .entries(datapoints)
 // console.log(nested)
 



  container
    .selectAll('.gift-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'gift-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      // which svg are we looking at?
      var svg = d3.select(this)
//console.log(nested)

      svg
        .selectAll('.bar')
   
        .data(function(d) {
          return d.values})
        .enter()
        .append('rect')
        .attr('class','bar')
        .attr('fill', 'salmon')
        .attr('y', height )
        .attr('y',function(d,i) {
        return heightScale(d.GiftAmount)
      })
      .attr('x', function(d,i) {
      //  console.log(d.values)
      // console.log(d.Year)
        return xPositionScale(d.year)
      })
      .attr('height', function(d,i) {
       // console.log(nested)
        return height - heightScale(d.GiftAmount)
      })
      .attr('width', xPositionScale.bandwidth())

      

 var ticks = [50000000,100000000,150000000,200000000,250000000,300000000]
 var tickLabels = [50,100,150,200,250,300]

      var yAxis = d3
        .axisLeft(heightScale)
        .tickValues(ticks)
        .tickFormat(function(d,i){
if (+d === 300000000) {
        return tickLabels[i] + " millions"
      } else {
        return tickLabels[i]
      }

        })


    var xAxis = d3
        .axisBottom(xPositionScale)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)



      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg
        .selectAll('.tick line')
        .attr('stroke-dasharray', '2 2')
        .attr('stroke', 'lightgrey')

      svg.selectAll('.domain').remove()

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('dy', -22)
        .attr('text-anchor', 'middle')
        .attr('fill', 'red')
        .attr('font-weight', 'bold')
        //console.log(d.values[0].GiftAmount)


      


    })
}

