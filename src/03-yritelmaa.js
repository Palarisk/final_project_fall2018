   .key(function(d) {
      if (d.Country !== 'BERMUDA') {
      return d.Country
    }
    })

***
import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 100, left: 40, right: 30, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 200 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales

var xPositionScale = d3
  .scaleBand()
  .domain([2012, 2017])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 200000000])
  .range([height, 0])

  var heightScale = d3
    .scaleLinear()
    .domain([0, 200000000])
    .range([0, height])

// Create your line generator

var line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.year)
  })
  .y(function(d) {
    return yPositionScale(d.GiftAmount)
  })



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

console.log(nested)

      svg
  
      .append('rect')
      .data(d.values)
      .attr('y',
       function(d) {
        return height - heightScale(d.GiftAmount)
      })
      
      .attr('x',
        function(d) {
        return xPositionScale(d['year'])

        
      })
     
      .attr('height', function(d) {
        return heightScale(d['GiftAmount'])
      })
      
      .attr('width', xPositionScale.bandwidth())
       
      .attr('fill', 'red')

        /* function(d) {
        return colorScale(d['animal'])
      })
*/
      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('stroke', '#9e4b6c')
        .attr('fill', 'none')
/*
       svg
        .append('path')
        .datum(usa)
        .attr('d', line)
        .attr('stroke', 'grey')
        .attr('fill', 'none')
*/

       svg
        .append('text')
        .text('USA')
        .attr('x', 15)
        .attr('y', 23)
        .attr('font-size', 9)
        .attr('stroke', 'grey')

      var xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(6)
        .tickFormat(d3.format('d'))
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3
        .axisLeft(yPositionScale)
        //.tickValues([5000, 10000, 15000, 20000])
        .tickSize(-width)
        .tickFormat(d3.format("$,d"))


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
        .attr('dy', -12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9e4b6c')
        .attr('font-weight', 'bold')
        console.log(d.key)
    })
}

export { xPositionScale, yPositionScale, line, width, height }
