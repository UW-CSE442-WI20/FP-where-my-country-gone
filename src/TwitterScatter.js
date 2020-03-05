const d3 = require('d3');

class TwitterScatter {

    constructor() {}
    
    drawTwitterSearch(politicians, since, until, sentiments, yAxis, period, input) {
        let wordmap;
        let tweetfile;
        if (period === '2016') {
            wordmap = require('./WordsToIds2016.json');
            tweetfile = 'TweetsArray2016.json';
        } else {
            wordmap = require('./WordsToIds.json');
            tweetfile = 'TweetsArray.json';
        }
        var tokens = input.trim().split(" ");
        var searchResults = [];
        let valid = true;
        let regex = /[^A-Za-z_]/;
        for (let i = 0; i < tokens.length; i++) {
            tokens[i] = tokens[i].toLowerCase().trim().replace(regex, "");
            if (wordmap[tokens[i]] == undefined) {
                valid = false;
            }
        }
        if (valid) {
            d3.json(tweetfile).then((data) => {
                let arr = wordmap[tokens[0]];
                for (let i = 0; i < arr.length; i++) {
                    // So that we store a copy rather than the references themselves
                    let nextTweet = data[arr[i]];
                    let tweetDate = new Date(nextTweet["date"]);
                    let validtweet = true;
                    if (tweetDate <= since || tweetDate >= until) {
                        validtweet = false;
                    } else if (!politicians.has(nextTweet['username'])) {
                        validtweet = false;
                    } else if (!sentiments.has(nextTweet['sentiment'])) {
                        validtweet = false;
                    }
                    if (validtweet) {
                        searchResults.push(arr[i]);
                    }
                }
                for (let i = 1; i < tokens.length; i++) {
                    let temp = [];  // Temp variable that holds valid dates.
                    let nextArray = wordmap[tokens[i]];
                    for (let j = 0; j < nextArray.length; j++) {
                        // Iterate through the next token's dates
                        for (let k = 0; k < searchResults.length; k++) {
                            // Iterate through the dates in search result
                            if (searchResults[k] == nextArray[j]) {
                                // only push those dates that are already in search result in temp
                                // as the results should be only the tweets that have all the words in the input.
                                temp.push(searchResults[k]);
                            }
                        }
                    }
                    searchResults = temp;
                }
                this.drawCanvasScatter(searchResults, yAxis, tweetfile);
            });
        }
    }

    // params:
    // democrats: the deomcrats selected.
    // republicans: the republicans selected.
    // since: the lower bound date.
    // until: the upper bound date.
    // sentiments: the sentiments selected.
    // yAxis: yAxis
    // period: the election period selected.
    
    drawTwitterScatter(democrats, republicans, since, until, sentiments, yAxis, period) {
        since = new Date(since);
        until = new Date(until);
        // console.log("dem: " , democrats)
        // console.log("rep: " , republicans)
        // console.log("since: " , since)
        // console.log("until :" , until)
        // console.log("sentiments " , sentiments)
        // console.log("yaxis" , yAxis)
        // console.log("period: " , period)

        let indexes = [];
        let intermmediate = [];
        let tmp;
        let dems;
        let repubs;
        let tweetsfile;
        if (period === 2016) {
            dems = require('./democrats2016.json');
            repubs = require('./republicans2016.json');
            tweetsfile = 'TweetsArray2016.json'
        } else {
            dems = require('./democrats.json');
            repubs = require('./republicans.json');
            tweetsfile = 'TweetsArray.json';
        }

        for (let i = 0; i < democrats.length; i++) {
            tmp = intermmediate.concat(dems[democrats[i]]);
            intermmediate = tmp;
        }
        
        for (let i = 0; i < republicans.length; i++) {
            tmp = intermmediate.concat(repubs[republicans[i]]);
            intermmediate = tmp;
        }
        d3.json(tweetsfile).then((data) => {
            for (let i = 0; i < intermmediate.length; i++) {
                let nextTweet = data[intermmediate[i]];
                let tweetDate = new Date(nextTweet["date"]);
                if (tweetDate <= since || tweetDate >= until) {
                    //console.log("got a problem with the dates")
                    continue;
                } else if (!sentiments.has(nextTweet['sentiment'])) {
                    continue;
                }
                indexes.push(intermmediate[i]);
            }
            
            
            //console.log("is this empty?", indexes)
            //this.drawScatter(indexes, yAxis, tweetsfile);
            this.drawCanvasScatter(indexes, yAxis, tweetsfile);
            
        });

    }
    
//
//     drawScatter(filterResults, yAx, tweetsfile) { //filter results is an array of indexes which correlate with the tweetsarray index
//         console.log(filterResults)
//         var margin = {top: 10, right: 30, bottom: 30, left: 60};
//         var width = 1100 - margin.left - margin.right;
//         var height = 700 - margin.top - margin.bottom;
//         var wid = width + margin.left + margin.right;
//         var hei = height + margin.top + margin.bottom;
//        
//        
//         var svg = d3.select("#dataviz svg" );
//         if(svg.size() == 0) {
//             svg = d3.select("#dataviz")
//                 .append("svg")
//                 .attr('preserveAspectRatio', 'xMinYMin meet')
//                 .attr('viewBox', "0 0 " + wid + " " + hei)
//                 //.attr("width", width + margin.left + margin.right)
//                 //.attr("height", height + margin.top + margin.bottom)
//                 .append("g1")
//                 .attr("transform",
//                     "translate(" + (margin.left + 30) + "," + margin.top + ")");
//         }
//        
//        
//         d3.json(tweetsfile).then((tweets) => {
//             // Convert to Date format
//             var parseTime = d3.timeParse("%m/%d/%y %H:%M");
//             var data = [];
//             for (var i = 0; i < filterResults.length; i++) {
//                 tweets[filterResults[i]]["date"] = parseTime(tweets[filterResults[i]]["date"]);
//                 data.push(tweets[filterResults[i]])
//             }
//            
//             // Zoom feature
//             var zoom = d3.zoom()
//                 .scaleExtent([1, 20])
//                 //translateExtent insert bounds
//                 //or restrict zoom to one axis
//                 .translateExtent([[0, 0], [width, height]])
//                 .extent([[0, 0], [width, height]])
//                 .on("zoom", zoomed);
//
//             // Add X axis
//             var x = d3.scaleTime()
//                 .domain(d3.extent(data, function (d) {
//                     return d["date"];
//                 }))
//                 .range([0, width]);
//             var xAxis = svg.append("g")
//                 .attr("transform", "translate(0," + (height - 20) + ")")
//                 .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));
//
//             // Add Y axis
//             var y = d3.scaleLinear()
//                 .domain(d3.extent(data, function (d) {
//                     return d[yAx];
//                 }))
//                 .range([height - 20, 0]);
//             var yAxis = svg.append("g")
//                 .attr("transform", "translate(10,0)")
//                 .call(d3.axisLeft(y));
//
//             // Text label for the x axis
//             svg.append("text")
//                 .attr("transform",
//                     "translate(" + (width / 2) + " ," +
//                     (height + margin.top + 20) + ")")
//                 .style("text-anchor", "middle")
//                 .style("font-family", "trebuchet ms")
//                 .text("Date");
//
//             // Text label for the y axis
//             svg.append("text")
//                 .attr("transform", "rotate(-90)")
//                 .attr("y", 0 - margin.left)
//                 .attr("x", 0 - (height / 2))
//                 .attr("dy", "1em")
//                 .style("text-anchor", "middle")
//                 .style("font-family", "trebuchet ms")
//                 .text(yAx);
//
//             // Define the div for the tooltip
//             var tooltip = d3.select("body")
//                 .append("div")
//                 .attr("class", "tooltip")
//                 .style("opacity", 0)
//                 .style("pointer-events", "none");
//
//             svg.append("rect")
//                 .attr("width", width)
//                 .attr("height", height)
//                 .style("fill", "none")
//                 .style("pointer-events", "all")
//                 //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
//                 .call(zoom);
//
//
//             var clip = svg.append("defs").append("svg:clipPath")
//                 .attr("id", "clip")
//                 .append("svg:rect")
//                 .attr("width", width)
//                 .attr("height", height - 20)
//                 .attr("x", 10)
//                 .attr("y", 0);
//
//             var scatter = svg.append('g')
//                 .attr("clip-path", "url(#clip)");
//
//             var formatTime = d3.timeFormat("%m/%d/%y");
//
//             //Add dots
//             scatter.selectAll("dot")
//                 .data(data)
//                 .enter()
//                 .append("circle")
//                 .attr("cx", function (d) {
//                     return x(d["date"]);
//                 })
//                 .attr("cy", function (d) {
//                     return y(d[yAx]);
//                 })
//                 .attr("r", 3)
//                 .style("fill", "#00acee")
//                 .on("mouseover", function (d) {
//                     tooltip.transition()
//                         .duration(200)
//                         .style("opacity", .9);
//                     tooltip.html("@" + d["username"] + ": " + d["text"] + "<br/>" + "date: " + formatTime(d["date"]) + "<br/>" + "Likes: " + d[yAx])
//                         .style("left", (d3.event.pageX) + "px")
//                         .style("top", (d3.event.pageY - 28) + "px");
//                 })
//                 .on("mouseout", function (d) {
//                     tooltip.transition()
//                         .duration(500)
//                         .style("opacity", 0);
//                 });
//             //
//             // function(d) {
//             //     if(searchResults == null){return "#00acee"} //"#cc2400"
//             //     for (var i = 0; i < searchResults.length; i++) {
//             //         if (searchResults[i] != null && searchResults[i].getTime() === d.Date.getTime()) {
//             //             return "#00acee";
//             //         }
//             //     }
//             //     return "none";
//             // })
//
//             var scat = scatter
//                 .selectAll("circle");
//
//             // scatter.exit()
//             //     .remove()
//
//             // Update chart when zooming
//             function updateChart() {
//
//                 // Recover the new scale
//                 var newX = d3.event.transform.rescaleX(x);
//                 var newY = d3.event.transform.rescaleY(y);
//
//                 // Update axes with these new boundaries
//                 xAxis.call(d3.axisBottom(newX))
//                 yAxis.call(d3.axisLeft(newY))
//
//                 // Update circle position
//
//                 scat.attr('cx', function (d) {
//                     return newX(d["date"])
//                 })
//                     .attr('cy', function (d) {
//                         return newY(d[yAx])
//                     });
//             }
//
//             function zoomed() {
//                 var newX = d3.event.transform.rescaleX(x);
//                 var newY = d3.event.transform.rescaleY(y);
//                 xAxis.call(d3.axisBottom(newX).tickFormat(function (date) {
//                     if (d3.event.transform.k == 1) {
//                         return d3.timeFormat("%b %Y")(date);
//                     } else {
//                         return d3.timeFormat("%b %e, %Y")(date);
//                     }
//                 }));
//                 scat.attr('cx', function (d) {
//                     return newX(d["date"]);
//                 })
//                     .attr('cy', function (d) {
//                         return newY(d[yAx]);
//                     });
//             }
//         })
//     }
//

    drawCanvasScatter(filterResults, yAx, tweetsfile) { //filter results is an array of indexes which correlate with the tweetsarray index

        var margin = {top: 10, right: 30, bottom: 30, left: 60};
        var outerWidth = 900;
        var outerHeight = 500;
        var width = outerWidth - margin.left - margin.right;
        var height = outerHeight - margin.top - margin.bottom;
        
        const container = d3.select('.scatter-container');
        let lastTransform = null;

        // Init SVG
        if(d3.select('.scatter-container svg g').size() == 0){
            var svgChart = container.append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)
                .attr('class', 'svg-plot')
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .attr('class', 'g-class');
        }else{
            svgChart = d3.select('g-class')
        }


        // Init Canvas
        if(d3.select('.scatter-container canvas').size() == 0){
            var canvasChart = container.append('canvas')
                .attr('width', width)
                .attr('height', height)
                //.classed('.canvas-plot', true)
                .style('margin-left', margin.left + 'px')
                .style('margin-top', margin.top + 'px')
                .attr('class', 'canvas-plot');
            
            // hidden canvas
            var hiddenCanvas = container.append('canvas')
                .attr('width', width)
                .attr('height', height)
                //.classed('.hidden-canvas', true)
                .style('margin-left', margin.left + 'px')
                .style('margin-top', margin.top + 'px')
                .attr('class', 'hidden-canvas');;
        }else{
            canvasChart = d3.select('.canvas-plot');
            hiddenCanvas = d3.select('.hidden-canvas')
        }
        
        const canv = canvasChart.node().getContext('2d');
        
        
        var customBase = document.createElement('custom');
        var custom = d3.select(customBase); // "virtual" SVG for tooltip with canvas
        
        /////////////////
        //Define the div for the tooltip
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("pointer-events", "none");
        
        
        // var svg = d3.select("#dataviz svg" );
        // if(svg.size() == 0) {
        //     svg = d3.select("#dataviz")
        //         .append("svg")
        //         .attr('preserveAspectRatio', 'xMinYMin meet')
        //         .attr('viewBox', "0 0 " + wid + " " + hei)
        //         //.attr("width", width + margin.left + margin.right)
        //         //.attr("height", height + margin.top + margin.bottom)
        //         .append("g1")
        //         .attr("transform",
        //             "translate(" + (margin.left + 30) + "," + margin.top + ")");
        // }


        d3.json(tweetsfile).then((tweets) => {
            // Convert to Date format
            var parseTime = d3.timeParse("%m/%d/%y %H:%M");
            var data = [];
            for (var i = 0; i < filterResults.length; i++) {
                tweets[filterResults[i]]["date"] = parseTime(tweets[filterResults[i]]["date"]);
                data.push(tweets[filterResults[i]])
            }
            

            // Add X axis
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) {
                    return d["date"];
                }))
                .range([0, width]).nice();
            
            const xAxis = svgChart.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    return d[yAx];
                }))
                .range([height, 0]).nice();
            
            const yAxis = svgChart.append("g")
                .call(d3.axisLeft(y));

            databind(data, x, y);

            // Text label for the x axis
            svgChart.append("text")
                .attr('x', `${width / 2}`)
                .attr('y', `${height -40}`)
                .text('Axis X');
                // .attr("transform",
                //     "translate(" + (width / 2) + " ," +
                //     (height + margin.top + 20) + ")")
                // .style("text-anchor", "middle")
                // .style("font-family", "trebuchet ms")
                // .text("Date");

            // Text label for the y axis
            svgChart.append("text")
                .attr('x', `-${height / 2}`)
                .attr('dy', '-3.5em')
                .attr('transform', 'rotate(-90)')
                .text('Axis Y');
                // .attr("transform", "rotate(-90)")
                // .attr("y", 0 - margin.left)
                // .attr("x", 0 - (height / 2))
                // .attr("dy", "1em")
                // .style("text-anchor", "middle")
                // .style("font-family", "trebuchet ms")
                // .text(yAx);


            canvasChart.on('mousemove',function(){
                draw(hiddenCanvas)
                var mouseX = d3.event.layerX || d3.event.offsetX;
                var mouseY = d3.event.layerY || d3.event.offsetY;
                
                var hiddenCtx = hiddenCanvas.node().getContext('2d');
                var col = hiddenCtx.getImageData(mouseX, mouseY, 1, 1,).data;
                console.log("col ", col)
                

            })
            
            function databind(data, x, y){
                var join = custom.selectAll('custom.circle')
                            .data(data);
                
                var enterSel = join.enter()
                        .append('custom')
                        .attr('class', 'circle')
                        .attr('x', function(d){
                            return x(d["date"]);
                        })
                        .attr('y', function(d){
                            return y(d[yAx]);
                        }).attr("r", 2);

                join.merge(enterSel)
                    .transition()
                    .attr('r', 3)
                    .attr('fillStyle', '#000000');

                var exitSel = join.exit().transition().attr('width', 0).attr('height', 0).remove();
                                  
            }


            // Initial draw made with no zoom
            draw(d3.zoomIdentity)

            function draw(transform) {
                lastTransform = transform;

                const scaleX = transform.rescaleX(x);
                const scaleY = transform.rescaleY(y);

                xAxis.call(d3.axisBottom(x).scale(scaleX));
                yAxis.call(d3.axisLeft(y).scale(scaleY));

                canv.clearRect(0, 0, width, height);
                var elements = custom.selectAll('custom.circle');
                elements.each(function(d) {
                    drawPoint(scaleX, scaleY, d, transform.k);
                });
            }
            function drawPoint(scaleX, scaleY, d, k) {
                canv.beginPath();
                canv.fillStyle = '#000000';
                const px = scaleX(d["date"]);
                const py = scaleY(d[yAx]);

                canv.arc(px, py, 2.5, 0, 2 * Math.PI, true);
                canv.fill();
            }

            
            const zoom_function = d3.zoom().scaleExtent([1, 1000]).translateExtent([[0, 0], [width, height]])
                .on('zoom', () => {
                    const transform = d3.event.transform;
                    canv.save();
                    draw(transform);
                    canv.restore();
                });
            
            canvasChart.call(zoom_function);
            
        })
    }
}

module.exports = TwitterScatter;