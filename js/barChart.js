function barChart(filterName){

    d3.csv("data/cleanTweets.csv", function(d) {

            return {
                Month: d.date.split('-').slice(0, 2).join('-'),
                Day: d.date,
                Total: 1,
                Name: d.handle
            };
        
    },function(error, rows){
        
        if (filterName != ""){
            filtered = rows.filter(function (a) { return a.Name === filterName; });
            chartData = filtered;
        } else{
            chartData = rows;
        }

         
        chartData.sort(function(a, b) {
            var dateA = new Date(a.Day), dateB = new Date(b.Day);
            return dateA - dateB;
        });

        // console.log("Complete Dataset: ", chartData);
        
        chartOptions = [{
            "captions": [{ "2016-01": "Jan 2016", "2016-02": "Feb 2016", "2016-03": "Mar 2016",
                        "2016-04": "Apr 2016", "2016-05": "May 2016", "2016-06": "June 2016",
                        "2016-07": "July 2016", "2016-08": "Aug 2016", "2016-09": "Sept 2016" }],
            "color": [{ "2016-01": "#1f77b4", "2016-02": "#ff7f0e", "2016-03": "#2ca02c",
                        "2016-04": "#d62728", "2016-05": "#9467bd", "2016-06": "#8c564b",
                        "2016-07": "#e377c2", "2016-08": "#7f7f7f", "2016-09": "#bcbd22" }],
            "xaxis": "Month",
            "xaxisl1": "Day",
            "yaxis": "Total"
        }]

        var salesData;
        var truncLengh = 30;

        d3.select("#" + "barChart" + " .barChart").select("svg").remove();

        Plot();

        function Plot() {
            TransformChartData(chartData, chartOptions);
            BuildBar("barChart", chartData, chartOptions);
        }

        function BuildBar(id, chartData, options, level) {
            
            chart = d3.select("#" + id + " .barChart");

            var margin = { top: 80, right: 0, bottom: 120, left: 90 };
            width = $($("#" + id + " .barChart")[0]).outerWidth() - margin.left - margin.right;
            height = $($("#" + id + " .barChart")[0]).outerHeight() - margin.top - margin.bottom -10;
            var xVarName;
            var yVarName = options[0].yaxis;

            if (level == 1) {
                xVarName = options[0].xaxisl1;    //Day
            }
            else {
                xVarName = options[0].xaxis;    //Month
            }

            var xAry = runningData.map(function (el) {
                return el[xVarName];
            });

            var yAry = runningData.map(function (el) {
                return el[yVarName];
            });

            var capAry = runningData.map(function (el) { return el.caption; });

            var x = d3.scaleBand().domain(xAry).rangeRound([0, width], .5);
            var y = d3.scaleLinear().domain([0, d3.max(runningData, function (d) { return d[yVarName]; })]).range([height, 0]);
            var rcolor = d3.scaleOrdinal().range(runningColors);

            chart = chart
                    .append("svg")  //append svg element inside #chart
                    .attr("width", width + margin.left + margin.right + 20)    //set width
                    .attr("height", height + margin.top + margin.bottom);  //set height

            var bar = chart.selectAll("g")
                            .data(runningData)
                            .enter()
                            .append("g")
                            .attr("transform", function (d) {
                                return "translate(" + x(d[xVarName]) + ", 0)";
                            });
            
            var ctrtxt = 0;
            var xAxis = d3.axisBottom()
                        .scale(x)
                        .ticks(xAry.length)
                        .tickFormat(function (d) {
                                if (level == 0) {
                                    var mapper = options[0].captions[0];
                                    return mapper[d];
                                } else {
                                    var r = runningData[ctrtxt].caption;
                                    ctrtxt += 1;
                                    return r;
                                }
                            });

            var yAxis = d3.axisLeft()
                        .scale(y)
                        .ticks(10); //orient left because y-axis tick labels will appear on the left side of the axis.

            bar.append("rect")
                .attr("y", function (d) {   
                    return y(d.Total) + margin.top - 15;
                }) 
                .attr("x", function (d) {
                    return (margin.left + (x.bandwidth()) / 4 );
                })
                .on("mouseenter", function (d) {
                    d3.select(this)
                        .attr("stroke", "white")
                        .attr("stroke-width", 1)
                        .attr("y", function (d) {   
                            return y(d.Total) + margin.top - 20;
                        })
                        .attr("height", function (d) {
                            return height - y(d[yVarName]) + 5;
                        })
                        .attr("x", function (d) {  
                            return (margin.left - 5 + (x.bandwidth()) / 4);
                        })
                        .attr("width", (x.bandwidth())/2+10)
                        .transition()
                        .duration(200);
                })
                .on("mouseleave", function (d) {
                    d3.select(this)
                        .attr("stroke", "none")
                        .attr("y", function (d) {
                            return y(d[yVarName]) + margin.top - 15;
                        })
                        .attr("height", function (d) {
                            return height - y(d[yVarName]);
                        })
                        .attr("x", function (d) {
                            return (margin.left + (x.bandwidth()) / 4);
                        })
                        .attr("width", (x.bandwidth()) / 2)
                        .transition()
                        .duration(200);
                })
                .on("click", function (d) {
                    if (this._listenToEvents) {
                        // Reset inmediatelly
                        d3.select(this).attr("transform", "translate(0,0)")
                        // Change level on click if no transition has started
                        path.each(function () {
                            this._listenToEvents = false;
                        });
                    }
                
                    d3.selectAll("#" + id + " svg").remove();
                
                    if (level == 1) {
                        TransformChartData(chartData, options, 0, d[xVarName]);
                        BuildBar(id, chartData, options, 0);
                    } else {
                        var nonSortedChart = chartData.sort(function (a, b) {
                            return parseFloat(b[options[0].yaxis]) - parseFloat(a[options[0].yaxis]);
                        });
                        TransformChartData(nonSortedChart, options, 1, d[xVarName]);
                        BuildBar(id, nonSortedChart, options, 1);
                    }
                });

            bar.selectAll("rect")
                .transition()
                .duration(1000)
                .attr("height", function (d) {
                    return height - y(d[yVarName]);
                })
                .attr("width", (x.bandwidth()) / 2); //set width base on range on ordinal data;

            //setTimeout( 1000)
            bar.selectAll("rect")
                .style("fill", function (d) {
                    return rcolor(d[xVarName]);
                }),
            
            // Total Value Text
            bar.append("text")
                .attr("x", x.bandwidth() / 2 + margin.left + 6)
                .attr("y", function (d) { return y(d[yVarName]) + margin.top - 30; })
                .attr("dy", ".35em")
                .style('fill','white')
                .text(function (d) {
                    return d[yVarName];
                });
            
            // Tooltip
            bar.append("svg:title")
                .text(function (d) {
                    // return "Trend";
                    return d["title"] + " - " + d[yVarName];
                });
            
            if(level==1){
                //x axis & title
                chart.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (height + margin.top - 15) + ")")
                    .call(xAxis);
                
                chart.append("g")
                    .attr("class", "x axis2")
                    .append("text")
                    .attr("dx", 400)
                    .attr("y", 500)
                    // .attr("transform", "rotate(30)")
                    .attr("transform", "translate(" + width/4.8 + "," + 25 +")")
                    .style("text-anchor", "end")
                    .text("Date");
            } else{
                chart.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (height + margin.top - 15) + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("x", width/2.1)
                    .attr("y", 45)
                    // .attr("transform", "translate( -20 ,28 )")
                    .style("text-anchor", "middle")
                    .text("Month");
            }

            //y axis & title
            chart.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + "," + (margin.top - 15) + ")")   //margin.left
                .call(yAxis)  //yAxis Label
                .append("text")
                .attr("transform", "translate(" + 26 + "," + -28 + ")")
                //  .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".81em")
                .style("text-anchor", "end")
                .text("Frequency");

            if (level == 1) {
                chart.select(".x.axis")
                .selectAll("text")
                .attr("transform", " translate(-16,5) rotate(-25)");
            } else {
                chart.select(".x.axis")
                .selectAll("text")
                .attr("transform", " translate(24,10)");
                // .style("fill","black");
            }
            

        } //BuildBar

        function TransformChartData(chartData, opts, level, filter) {
            var result = [];
            var resultColors = [];
            var counter = 0;
            var hasMatch;
            var xVarName;
            var yVarName = opts[0].yaxis;

            if (level == 1) {
                xVarName = opts[0].xaxisl1;  //Day

                for (var i in chartData) {
                    hasMatch = false;
                    for (var index = 0; index < result.length; ++index) {
                        var data = result[index];
                        if ((data[xVarName] == chartData[i][xVarName]) && (chartData[i][opts[0].xaxis]) == filter) {
                            result[index][yVarName] = result[index][yVarName] + chartData[i][yVarName];
                            hasMatch = true;
                            break;
                        }
                    }
                    if ((hasMatch == false) && ((chartData[i][opts[0].xaxis]) == filter)) {
                        if (result.length < 32) {      //9
                            ditem = {}
                            ditem[xVarName] = chartData[i][xVarName];
                            ditem[yVarName] = chartData[i][yVarName];
                            ditem["caption"] = chartData[i][xVarName].substring(0, 10) ; //+ '...';
                            ditem["title"] = chartData[i][xVarName];
                            ditem["op"] = 1.0 - parseFloat("0." + (result.length));
                            result.push(ditem);

                            resultColors[counter] = opts[0].color[0][chartData[i][opts[0].xaxis]];

                            counter += 1;
                        }
                    }
                }
            } else {
                xVarName = opts[0].xaxis; //Month

                for (var i in chartData) {
                    hasMatch = false;
                    for (var index = 0; index < result.length; ++index) {
                        var data = result[index];

                        if (data[xVarName] == chartData[i][xVarName]) {
                            result[index][yVarName] = result[index][yVarName] + chartData[i][yVarName];
                            hasMatch = true;
                            break;
                        }
                    }
                    if (hasMatch == false) {
                        ditem = {};
                        ditem[xVarName] = chartData[i][xVarName];
                        ditem[yVarName] = chartData[i][yVarName];
                        ditem["caption"] = opts[0].captions != undefined ? opts[0].captions[0][chartData[i][xVarName]] : "";
                        ditem["title"] = opts[0].captions != undefined ? opts[0].captions[0][chartData[i][xVarName]] : "";
                        ditem["op"] = 1;
                        result.push(ditem);

                        resultColors[counter] = opts[0].color != undefined ? opts[0].color[0][chartData[i][xVarName]] : "";

                        counter += 1;
                    }
                }
            }   

            runningData = result;
            runningColors = resultColors;
            return;
            
        } //TransformChartData

    }); //parseCSV
}
