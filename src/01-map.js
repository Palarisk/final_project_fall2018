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

// Create a time parser 

let parseTime = d3.timeParse('%Y')

// Create your scales

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()

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
    d.datetime = +d.year
  })

  // Get a list of dates and a list of prices

  let years = datapoints.map(d => d.datetime)
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
  /*
  d3.select('#usual').on('stepin', () => {
 
    
*/
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
    .attr('visibility', function(d) {
      if (d.key === 'BERMUDA') {
        return 'hidden'
      }
      return 'visible'
    })
    .lower()
    .attr('opacity', 0)
    .transition()
    .duration(500)
    .attr('opacity', 1)

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
    .attr('visibility', function(d) {
      if (d.key === 'BERMUDA') {
        return 'hidden'
      }
      return 'visible'
    })

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
    .attr('visibility', function(d) {
      if (d.key === 'BERMUDA') {
        return 'hidden'
      }
      return 'visible'
    })
    .attr('opacity', 0)
    .transition()
    .duration(500)
    .attr('opacity', 1)

  //  })

  d3.select('#bermuda').on('stepin', () => {
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
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1)

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
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1)

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
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1)
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

  d3.select('#dots')
    .on('stepin', () => {
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

      // QATAR-point
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
    })
    .on('stepout', () => {
      svg.selectAll('.england_circle')
      .attr('visibility', function(d) {
          if (d.key === 'ENGLAND') {
            return 'hidden'
          }
         } )
    })

  // Add your axes

  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickValues(d3.range(2012, 2017.1))
    .tickFormat(d => d)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)



  var yAxis = d3
    .axisLeft(yPositionScale)
    .ticks(7)
    .tickFormat(function(d) {
      console.log(d)
      if (+d === 700000000) {
        return d / 1000000 + ' millions'
      } else {
        return d / 1000000
      }
    })

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
