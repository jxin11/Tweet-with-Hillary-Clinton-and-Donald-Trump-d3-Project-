function parallelCoord(filterName){

    d3.select("#parallelCoord").select("svg").remove();

    var margin = {top: 40, right: -60, bottom: 150, left: 45},
    width = 800 - margin.left - margin.right,
    height =700 - margin.top - margin.bottom;

    var dimensions = [
    {
        name: "textLength",
        vizName: "Length of Tweet",
        scale: d3.scaleLinear().range([height, 0]), //d3.scale.linear().range([height, 0])
        type: "number"
    },
    {
        name: "favorite_count",
        vizName: "Favourite Count",
        scale: d3.scaleLinear().range([height, 0]), //d3.scale.linear().range([height, 0])
        type: "number"
    },
    {
        name: "retweet_count",
        vizName: "Retweet Count",
        scale: d3.scaleLinear().range([height, 0]), //d3.scale.linear().range([height, 0])
        type: "number"
    }];

    var x = d3.scaleBand()     //d3.scale.ordinal()
            .domain(dimensions.map(function(d) { return d.name; }))
            .rangeRound([0, width]);  //.rangePoints([0, width])

    var line = d3.line()      //d3.svg.line()
                .defined(function(d) { return !isNaN(d[1]); });

    var yAxis = d3.axisLeft();   //d3.svg.axis()
        // .orient("left");

    var svg = d3.select("#parallelCoord").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data/cleanTweets.csv", function(data) {

        // Extract the list of dimensions and create a scale for each.
        dimensions.forEach(function(dimension) {
            dimension.scale.domain(dimension.type === "number"
            ? d3.extent(data, function(d) { return +d[dimension.name]; })
            : data.map(function(d) { return d[dimension.name]; }).sort());
        });

        //background
        svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            //.data(data)
            //.filter(function(d) { return d.handle == "realDonaldTrump";})
            .data(data.filter(function(d){return d.handle == filterName;}))    //To filter the data
            .enter().append("path")
            .attr("d", draw);

        //foreground
        svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            //.data(data)
            //.filter(function(d) { return d.handle == "realDonaldTrump";})
            .data(data.filter(function(d){return d.handle == filterName;}))   //To filter the data
            .enter().append("path")
            .attr("d", draw);

        var dimension = svg.selectAll(".dimension")
                        .data(dimensions)
                        .enter().append("g")
                        .attr("class", "dimension")
                        .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });

        var ordinal_labels = svg.selectAll(".axis text")
                                .on("mouseover", mouseover)
                                .on("mouseout", mouseout);

        var projection = svg.selectAll(".background path,.foreground path")
                            .on("mouseover", mouseover)
                            .on("mouseout", mouseout);

        function mouseover(d) {
            svg.classed("active", true);

            // this could be more elegant
            if (typeof d === "number") {
            projection.classed("inactive", function(p) { return p.name !== d; });
            projection.filter(function(p) { return p.name === d; }).each(moveToFront);
            ordinal_labels.classed("inactive", function(p) { return p !== d; });
            ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
            } else {
            projection.classed("inactive", function(p) { return p !== d; });
            projection.filter(function(p) { return p === d; }).each(moveToFront);
            ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
            ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
            }
        }

        function mouseout(d) {
            svg.classed("active", false);
            projection.classed("inactive", false);
            ordinal_labels.classed("inactive", false);
        }

        function moveToFront() {
            this.parentNode.appendChild(this);
        }

        //axis
        dimension.append("g")
                .attr("class", "axis")
                .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
                // Add axis title
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d.vizName; })
                .style("fill", "white");

        function draw(d) {
            return line(dimensions.map(function(dimension) {
                return [x(dimension.name), dimension.scale(d[dimension.name])];
            }));
        }
    });
}