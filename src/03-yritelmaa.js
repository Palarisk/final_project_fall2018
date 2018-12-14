01 silleen että yrittäs käyttää scalebandia muttei toimi
import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 100, left: 100, right: 105, bottom: 80 }

var height = 700 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

// Add your svg

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)

let parseTime = d3.timeParse('%Y')

// Create your scales

let xPositionScale = d3.scaleBand().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  // .domain([100, 355])
  .range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a'
  ])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  // TULEEKS d.datetime vai d.month???
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.GiftAmount))

// Read in your housing price data

d3.csv(require('./data/gift_data_top5_2012_2017.csv'))
  .then(ready)
  .catch(err => {
    //  console.log("The error is", err)
  })

// Write your ready function

function ready(datapoints) {
  // console.log('Data is', datapoints)
  // Convert your months to dates

  datapoints.forEach(d => {
    d.datetime = parseTime(d.year)
  })

  // Get a list of dates and a list of prices

  let years = datapoints.map(d => d.datetime)
  //console.log(d3.extent(years))
  let years_string = datapoints.map(d => d.year)
  // console.log(d3.extent(years_string))

 console.log(years_string)

   let gifts = datapoints.map(d => +d.GiftAmount)

  //xPositionScale.domain(d3.extent(years))
  xPositionScale.domain(d3.extent(years_string))
  yPositionScale.domain(d3.extent(gifts))

  // Group your data together

  var nested = d3
    .nest()
    .key(d => d.Country)
    .entries(datapoints)

  //console.log(nested)

  // Draw your lines

  svg
    .selectAll('.price-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-line')
    .attr('class', function(d) {
      return d.key
    })
    .attr('d', d => {
      // d.key on esim NYC ja d.values on noi kaikki datapoints
      // console.log(d)
      return line(d.values)
    })
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()

  // Adding my circles

  svg
    .selectAll('.last-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'last-circle')
    .attr('r', 3)
    .attr('cx', width)
    .attr('cy', function(d) {
      // console.log(d.values[5])
      return yPositionScale(d.values[5].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))

  // Add your text on the right-hand side

  svg
    .selectAll('.region-label')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'region-label')
    .text(function(d) {
      return d.key
    })
    .attr('x', width)
    .attr('y', function(d) {
      return yPositionScale(d.values[5].GiftAmount)
    })
    .attr('font-size', 12)
    .attr('dx', 5)
    .attr('dy', function(d) {
      if (d.key === 'CHINA') {
        return -2
      }
      if (d.key === 'SAUDI ARABIA') {
        return 6
      }
      return 3
    })

  // Add your title

  svg
    .append('text')
    .text("Something's going on in Bermuda in 2016")
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)

  svg
    .append('text')
    .text(
      'The top 5 countries with the biggest total sum of donations in 2012-2017'
    )
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .attr('font-size', 16)

  // Bermuda-point

  svg
    .selectAll('.bermuda-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'bermuda-circle')
    // .attr('class', 'last-circle')
    .attr('r', 8)
    .attr('cx', function(d) {
      return xPositionScale(d.values[4].datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[4].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))
    .attr('visibility', function(d) {
      if (d.key === 'BERMUDA') {
        return 'visible'
      }
      return 'hidden'
    })
    .on('mouseover', function(d) {
      console.log('I got clicked')

      d3.select('#info_bermuda').style('display', 'block')
      d3.select('.bermuda-circle')
        .attr('r', 10)
        .attr('stroke', 'black')
    })
    .on('mouseout', function(d) {
      d3.select('#info_bermuda').style('display', 'none')
      d3.select('.bermuda-circle')
        .attr('r', 8)
        .attr('stroke', 'none')
    })

//QATAR-point 
  svg
    .selectAll('.qatar-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'qatar-circle')
    // .attr('class', 'last-circle')
    .attr('r', 8)
    .attr('cx', function(d) {
      return xPositionScale(d.values[4].datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[4].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))
    .attr('visibility', function(d) {
      if (d.key === 'QATAR') {
        return 'visible'
      }
      return 'hidden'
    })
    .on('mouseover', function(d) {
      console.log('I got clicked')

      d3.select('#info_qatar').style('display', 'block')
      d3.select(this)
        .attr('r', 10)
        .attr('stroke', 'black')
    })
    .on('mouseout', function(d) {
      d3.select('#info_qatar').style('display', 'none')
      d3.select(this)
        .attr('r', 8)
        .attr('stroke', 'none')
    })


  // ENGLAND-point

  svg
    .selectAll('.england-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'last-circle')
    .attr('r', 8)
    .attr('cx', function(d) {
      return xPositionScale(d.values[3].datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[3].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))
    .attr('visibility', function(d) {
      if (d.key === 'ENGLAND') {
        return 'visible'
      }
      return 'hidden'
    })
    .on('mouseover', function(d) {
      console.log('I got clicked')

      d3.select('#info_england').style('display', 'block')
      d3.select(this)
        .attr('r', 10)
        .attr('stroke', 'black')
    })
    .on('mouseout', function(d) {
      d3.select('#info_england').style('display', 'none')
      d3.select(this)
        .attr('r', 8)
        .attr('stroke', 'none')
    })

  // Add your axes

  var xAxis = d3
  .axisBottom(xPositionScale)
  .ticks(7)
  //.tickFormat(d3.timeFormat('%Y'))
  //.tickValues([new Date("2012"), new Date("2013"), new Date("2014"),
  //  new Date("2015"),new Date("2016"), new Date("2017")])


  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  // .call(xAxis.ticks(d3.timeYear))

  // console.log(xPositionScale.domain())
  var yAxis = d3.axisLeft(yPositionScale)
 .ticks(7)
  .tickFormat(function(d){
    //console.log(d)
       if (+d === 700000000) {
    return d/1000000 + ' millions' 
   } else {
        return d/1000000
      }
  })

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
export {
  xPositionScale,
  yPositionScale,
  colorScale,
  line,
  width,
  height,
  parseTime
}




***************************************
01

import * as d3 from 'd3'

// Set up margin/height/width

var margin = { top: 100, left: 100, right: 105, bottom: 80 }

var height = 700 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

// Add your svg

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)

let parseTime = d3.timeParse('%Y')

// Create your scales

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  // .domain([100, 355])
  .range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a'
  ])

// Create a d3.line function that uses your scales

var line = d3
  .line()
  // TULEEKS d.datetime vai d.month???
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.GiftAmount))

// Read in your housing price data

d3.csv(require('./data/gift_data_top5_2012_2017.csv'))
  .then(ready)
  .catch(err => {
    //  console.log("The error is", err)
  })

// Write your ready function

function ready(datapoints) {
  // console.log('Data is', datapoints)
  // Convert your months to dates

  datapoints.forEach(d => {
    d.datetime = parseTime(d.year)
  })

  // Get a list of dates and a list of prices

  let years = datapoints.map(d => d.datetime)
  console.log(d3.extent(years))
  let gifts = datapoints.map(d => +d.GiftAmount)

  xPositionScale.domain(d3.extent(years))

  yPositionScale.domain(d3.extent(gifts))

  // Group your data together

  var nested = d3
    .nest()
    .key(d => d.Country)
    .entries(datapoints)

  console.log(nested)

  // Draw your lines

  svg
    .selectAll('.price-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-line')
    .attr('class', function(d) {
      return d.key
    })
    .attr('d', d => {
      // d.key on esim NYC ja d.values on noi kaikki datapoints
      // console.log(d)
      return line(d.values)
    })
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .lower()

  // Adding my circles

  svg
    .selectAll('.last-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'last-circle')
    .attr('r', 3)
    .attr('cx', width)
    .attr('cy', function(d) {
      // console.log(d.values[5])
      return yPositionScale(d.values[5].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))

  // Add your text on the right-hand side

  svg
    .selectAll('.region-label')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'region-label')
    .text(function(d) {
      return d.key
    })
    .attr('x', width)
    .attr('y', function(d) {
      return yPositionScale(d.values[5].GiftAmount)
    })
    .attr('font-size', 12)
    .attr('dx', 5)
    .attr('dy', function(d) {
      if (d.key === 'CHINA') {
        return -2
      }
      if (d.key === 'SAUDI ARABIA') {
        return 6
      }
      return 3
    })

  // Add your title

  svg
    .append('text')
    .text("Something's going on in Bermuda in 2016")
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .attr('font-size', 30)

  svg
    .append('text')
    .text(
      'The top 5 countries with the biggest total sum of donations in 2012-2017'
    )
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .attr('font-size', 16)

  // Bermuda-point

  svg
    .selectAll('.bermuda-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'bermuda-circle')
    // .attr('class', 'last-circle')
    .attr('r', 8)
    .attr('cx', function(d) {
      return xPositionScale(d.values[4].datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[4].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))
    .attr('visibility', function(d) {
      if (d.key === 'BERMUDA') {
        return 'visible'
      }
      return 'hidden'
    })
    .on('mouseover', function(d) {
      console.log('I got clicked')

      d3.select('#info_bermuda').style('display', 'block')
      d3.select('.bermuda-circle')
        .attr('r', 10)
        .attr('stroke', 'black')
    })
    .on('mouseout', function(d) {
      d3.select('#info_bermuda').style('display', 'none')
      d3.select('.bermuda-circle')
        .attr('r', 8)
        .attr('stroke', 'none')
    })

//QATAR-point 
  svg
    .selectAll('.qatar-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'qatar-circle')
    // .attr('class', 'last-circle')
    .attr('r', 8)
    .attr('cx', function(d) {
      return xPositionScale(d.values[4].datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[4].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))
    .attr('visibility', function(d) {
      if (d.key === 'QATAR') {
        return 'visible'
      }
      return 'hidden'
    })
    .on('mouseover', function(d) {
      console.log('I got clicked')

      d3.select('#info_qatar').style('display', 'block')
      d3.select(this)
        .attr('r', 10)
        .attr('stroke', 'black')
    })
    .on('mouseout', function(d) {
      d3.select('#info_qatar').style('display', 'none')
      d3.select(this)
        .attr('r', 8)
        .attr('stroke', 'none')
    })


  // ENGLAND-point

  svg
    .selectAll('.england-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', function(d) {
      return d.key
    })
    // .attr('class', 'last-circle')
    .attr('r', 8)
    .attr('cx', function(d) {
      return xPositionScale(d.values[3].datetime)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.values[3].GiftAmount)
    })
    .attr('fill', d => colorScale(d.key))
    .attr('visibility', function(d) {
      if (d.key === 'ENGLAND') {
        return 'visible'
      }
      return 'hidden'
    })
    .on('mouseover', function(d) {
      console.log('I got clicked')

      d3.select('#info_england').style('display', 'block')
      d3.select(this)
        .attr('r', 10)
        .attr('stroke', 'black')
    })
    .on('mouseout', function(d) {
      d3.select('#info_england').style('display', 'none')
      d3.select(this)
        .attr('r', 8)
        .attr('stroke', 'none')
    })

  // Add your axes

  var xAxis = d3
  .axisBottom(xPositionScale)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues([new Date("2012"), new Date("2013"), new Date("2014"),
    new Date("2015"),new Date("2016"), new Date("2017")])


  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  // .call(xAxis.ticks(d3.timeYear))

  // console.log(xPositionScale.domain())
  var yAxis = d3.axisLeft(yPositionScale)
 .ticks(7)
  .tickFormat(function(d){
    console.log(d)
       if (+d === 700000000) {
    return d/1000000 + ' millions' 
   } else {
        return d/1000000
      }
  })

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
export {
  xPositionScale,
  yPositionScale,
  colorScale,
  line,
  width,
  height,
  parseTime
}

***
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
