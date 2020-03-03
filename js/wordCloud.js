function wordCloud(filterName){

    d3.select(".wordCloud").select("svg").remove();
    d3.select("#word").text("Word");
    d3.select("#candidate").text("Word");
    d3.selectAll(".tweets").remove();

    var h = 380,
        w = 1000/2,
        svgWordCloud = d3.select(".wordCloud").append("svg").attr("width", w).attr("height", h/2.8);
        
    var colorHillaryClinton = ["#ff0800", "#ed2939", "#ea3c53", "#f20d69"],
        colorrealDonaldTrump = ["#4073bf", "#3d6bf5", "#2d90d2", "#759ef0"],
        layoutCandidate;

    var dataset;
        
    changeDensity = function(d){
        density = parseInt(d.value);
        load(dataset.score_HillaryClinton, dataset.score_realDonaldTrump);
    }   

    changeScore = function(d){
        score = 400-parseInt(d.value);
        load(dataset.score_HillaryClinton.slice(score,score+density), dataset.score_realDonaldTrump.slice(score,score+density) );
    }     

    load = function(score_Candidate, candidate){
            
        svgWordCloud.selectAll("*").remove()
            
        var size = d3.scaleLinear().range([15,70]).domain([
            d3.min(score_Candidate, function(d){return d.score}),
            d3.max(score_Candidate, function(d){return d.score})]);

        layoutCandidate = d3.layout.cloud()
                            .size([w, h])
                            .words(score_Candidate.map(function(d) {return {text: d.word, size: size(d.score), score: d.score, candidate: candidate, tag: d.tag} ;}))
                            .padding(5)
                            .rotate(0)
                            .font("fantasy")
                            .fontSize(function(d) { return d.size; })
                            .on("end", drawCandidate);
        layoutCandidate.start();
    }


    handleClick = function(d){			
                    d3.select("#word").text(d.text);
                    d3.selectAll(".tweets").remove();

                    if(d.candidate == "HillaryClinton"){
                        d3.select("#candidate").text("@HillaryClinton : " + dataset.index_HillaryClinton[d.text].length 
                                                    + " (" + d3.format(".1%")(dataset.index_HillaryClinton[d.text].length/dataset.n_HillaryClinton) + ")");

                        var indexHillaryClinton =  dataset.index_HillaryClinton[d.text];

                        for(var i=0; i<indexHillaryClinton.length; i++){
                            if(indexHillaryClinton[i] === undefined ){} else{
                                if(dataset.complete_HillaryClinton[indexHillaryClinton[i]] === undefined){ dataset.complete_HillaryClinton[indexHillaryClinton[i]].time = "unknown time"}
                                
                                d3.select("#tweetsContainer").append("p").html(
                                    dataset.complete_HillaryClinton[indexHillaryClinton[i]].text +
                                    "<span class='tooltiptext'>" + dataset.complete_HillaryClinton[indexHillaryClinton[i]].time+ "</br>" + dataset.complete_HillaryClinton[indexHillaryClinton[i]].tag + "</span>").attr("class", "tweets").style("background-color", colorHillaryClinton[2]);
                            }
                        }
                    }
                    else {
                        d3.select("#candidate").text("@realDonaldTrump : " + dataset.index_realDonaldTrump[d.text].length
                                                    + " (" + d3.format(".1%")(dataset.index_realDonaldTrump[d.text].length/dataset.n_realDonaldTrump) + ")");

                        var indexrealDonaldTrump = dataset.index_realDonaldTrump[d.text]; 

                        for(var i=0; i<indexrealDonaldTrump.length; i++){
                            if(indexrealDonaldTrump[i] === undefined ){} else{
                                if(dataset.complete_realDonaldTrump[indexrealDonaldTrump[i]] === undefined){ dataset.complete_realDonaldTrump[indexrealDonaldTrump[i]].time = "unkown time"}
                            
                                d3.select("#tweetsContainer").append("p").html( dataset.complete_realDonaldTrump[indexrealDonaldTrump[i]].text+"<span class='tooltiptext'>" + dataset.complete_realDonaldTrump[indexrealDonaldTrump[i]].time + "</br>" + dataset.complete_realDonaldTrump[indexrealDonaldTrump[i]].tag + "</span>"
                                ).attr("class", "tweets").style("background-color", colorrealDonaldTrump[3])
                            }
                        }
                    }
                }

    d3.json("data/tweets.json", function(data){
        dataset = data;

        //change candidate name here
        var candidate = filterName;

        if(candidate == "HillaryClinton")
            load(data.score_HillaryClinton, candidate);
        else 
            load(data.score_realDonaldTrump, candidate);
    })

    function drawCandidate(words) {
        svgWordCloud.append("g")
                    .attr("transform", "translate(" + (layoutCandidate.size()[0]*1.4) + "," + (layoutCandidate.size()[1]/2)+ ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("font-family", "Impact")
                    .style("fill", function(d, i) { 
                        if(d.candidate == "HillaryClinton") 
                            return colorHillaryClinton[i%4]; 
                        else
                            return colorrealDonaldTrump[i%4]; 
                    })
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
                    .text(function(d) { return d.text; })
                    .attr("opacity", 0.7)
                    .on("mouseover", function(d){d3.select(this).attr("opacity", 1); })
                    .on("mouseout", function(d){d3.select(this).attr("opacity", 0.7);} )
                    .on("click", handleClick);
    }
}