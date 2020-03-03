function heatMap(filterName){

    d3.select("#heatMap").select("svg").remove();

    const margin = { top: 50, right: 0, bottom: 100, left: 90 },
        width = 1260 - margin.left - margin.right,
        height = 540 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize*2,
        buckets = 9,
        colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
        days = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"];
        datasets = ["data/cleanTweets.csv"];

    const svg = d3.select("#heatMap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("y", function (d, i) { return i * gridSize; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
          .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

    const timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
          .text(function(d) { return d; })
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + gridSize / 2 + ", -6)")
          .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

    var Tooltip = d3.select("#heatMap")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "4px")
        .style("position", "absolute")
    
        var mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function(d) {
      
      Tooltip
        .html("Value: " + d.value)
        // .style("left", (d3.mouse(this)[0]+70) + "px")
        // .style("top", (d3.mouse(this)[1]+1700) + "px")

        // .style("left", (d.clientY+20)+'px')//(d3.mouse(this)[0]/2) + "px")
        // .style("top", (d.clientX+20)+'px')//(d3.mouse(this)[0]) + "px")

        .style("top", (event.pageY+20)+"px")
        .style("left",(event.pageX+20)+"px");
    }

    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
    }

      const heatmapChart = function(csvFile) {
        d3.csv(csvFile,
        function(d) {
          return {
            day: new Date(d.date),
            hour: parseInt (d.time.slice(0, 2)),
            value: 1,
            name: d.handle
          };
        },
        function(error, data) {
            data=data.filter(function(a){return a.name === filterName})
            data.forEach(function(a){
              const temp = new Date(a.day);
              a.day = temp.getDay();
          });
        
        data.sort(function (a, b) {
            var aSize = a.day;
            var bSize = b.day;
            var aLow = a.hour;
            var bLow = b.hour;

            if(aSize == bSize)
            {
                return (aLow < bLow) ? -1 : (aLow > bLow) ? 1 : 0;
            }
            else
            {
                return (aSize < bSize) ? -1 : 1;
            }
        });

        var length = data.length;

          for (var i = 0; i <= data.length-1; i+=1) {
              var count = 0;
              for(var j = i+1; j <= data.length-1; j += 1) {
                  if(data[i].day === data[j].day && data[i].hour === data[j].hour) {
                      count++;
                      data[i].value += data[j].value;
                  }
              }
              data.splice(i+1, count);
          }

        var len = data.length;
        var dCount = 0;
        var hCount = 0;
        var m = 0;
        do{
          // console.log(dCount, hCount);
          var day = data[m].day;
          var hr = data[m].hour;
          // console.log(day, hr);
          if (day == dCount){
            if (hr != hCount){
              data.push({day: dCount, hour: hCount, value: 0});
              m = m-1;
            }
          }
          
          if (hCount<23) {hCount+=1;}
          else if (hCount==23){
            dCount += 1;
            hCount=0;
          }

          m++;
          
        }while(m<len);
      //  console.log(data);
        const colorScale = d3.scaleQuantile()
        // var colorScale = d3.scaleQuantile()
            .domain([0, buckets - 1, d3.max(data, function (data) { return data.value; })])
            .range(colors);

        const cards = svg.selectAll(".hour")
        // var cards = svg.selectAll(".hour")
            .data(data, function(d) {return d.day+':'+d.hour;});

        cards.append("title");

        cards.enter().append("rect")
            .attr("x", function(d) { return (d.hour ) * gridSize; })
            .attr("y", function(d) { return (d.day ) * gridSize; })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])
            .attr("class", "square") 
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)             
            .merge(cards)//new line
            .transition()
            .duration(1000)
            .style("fill", function(d){ return colorScale(d.value)})

        // cards.transition().duration(1000)
        //     .style("fill", function(d) { return colorScale(d.value); });

        cards.select("title").text(function(d) { return d.value; });
        
        cards.exit().remove();

        const legend = svg.selectAll(".legend")
        // var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; });

        const legend_g = legend.enter().append("g")
        // legend.enter().append("g")
            .attr("class", "legend");

        legend_g.append("rect")
          .attr("x", function(d, i) { return legendElementWidth * i; })
          .attr("y", height  )
          .attr("width", legendElementWidth)
          .attr("height", gridSize / 2)
          .style("fill", function(d, i) { return colors[i]; });

        legend_g.append("text")
          .attr("class", "mono")
          .text(function(d) { return "≥ " + Math.round(d); })
          .attr("x", function(d, i) { return legendElementWidth * i; })
          .attr("y", height + gridSize);

        legend.exit().remove();

      });  
    };

    heatmapChart(datasets[0]);
  }