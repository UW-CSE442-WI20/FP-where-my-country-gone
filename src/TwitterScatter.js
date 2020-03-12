const d3 = require('d3');

class TwitterScatter {

    constructor() {}
    
    drawTwitterSearch(politicians, since, until, sentiments, yAxis, period, input, summaryInstance) {
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
                this.drawScatter(searchResults, yAxis, tweetfile);
            });
        }
    }

    // params:
    // democrats: the deomcrats selected as an array.
    // republicans: the republicans selected as an array.
    // since: the lower bound date.
    // until: the upper bound date.
    // sentiments: the sentiments selected as a set.
    // yAxis: yAxis
    // period: the election period selected.
    
    drawTwitterScatter(democrats, republicans, since, until, sentiments, yAxis, period, summaryInstance) {
        since = new Date(since);
        until = new Date(until);

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
            console.log("here in TS.js");
            this.drawScatter(indexes, yAxis, tweetsfile);
            
        });

    }
    

    drawScatter(filterResults, yAx, tweetsfile) { //filter results is an array of indexes which correlate with the tweetsarray index
        console.log("svg draw" , filterResults);
        console.log('my yax', yAx);
        var margin = {top: 10, right: 30, bottom: 30, left:80};
        var width = 1100 - margin.left - margin.right;
        var height = 700 - margin.top - margin.bottom;
        var wid = width + margin.left + margin.right;
        var hei = height + margin.top + margin.bottom;
        var svg;
        d3.select('#scatter-container svg').remove();
        
        svg = d3.select("#scatter-container svg" );
        if(svg.size() == 0) {
            svg = d3.select("#scatter-container")
                .append("svg")
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', "0 0 " + (wid) +  " " + (hei))
                // .attr("width", width + margin.left + margin.right)
                // .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
                
        }
        
        // svg.append("g1")
        //     .attr("transform",
        //         "translate(" + (margin.left + 30) + "," + margin.top + ")");
        // svg.append("text").attr("transform",
        //     "translate(" + (width/2) + " ," + (height/2) + ")")
        //     .style("text-anchor", "middle")
        //     .style("font-family", "trebuchet ms").text("Date");


        d3.json(tweetsfile).then((tweets) => {
            // Convert to Date format
            var parseTime = d3.timeParse("%m/%d/%y %H:%M");
            var data = [];
            for (var i = 0; i < filterResults.length; i++) {
                tweets[filterResults[i]]["date"] = parseTime(tweets[filterResults[i]]["date"]);
                data.push(tweets[filterResults[i]])
            }

            // Zoom feature
            var zoom = d3.zoom()
                .scaleExtent([1, 20])
                //translateExtent insert bounds
                //or restrict zoom to one axis
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            // Add X axis
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) {
                    return d["date"];
                }))
                .range([0, width]);
            var xAxis = svg.append("g")
                .attr("transform", "translate(0," + (height - 20) + ")")
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    console.log('here is d[yAx]', d[yAx]);
                    return d[yAx];
                }))
                .range([height - 20, 0]).nice();

            var yAxis = svg.append("g")
                //.attr("transform", "translate(100,0)")
                .call(d3.axisLeft(y).tickFormat(d3.format(".0s")).ticks(5));

            // Text label for the x axis
            svg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .style("font-family", "trebuchet ms")
                .text("Date");

            // Text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-family", "trebuchet ms")
                .text(yAx);

            // Define the div for the tooltip
            var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("pointer-events", "none");

            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(zoom);


            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height - 20)
                .attr("x", 10)
                .attr("y", 0);

            var scatter = svg.append('g')
                .attr("clip-path", "url(#clip)");

            var formatTime = d3.timeFormat("%m/%d/%y");

            //Add dots
            scatter.selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return x(d["date"]);
                })
                .attr("cy", function (d) {
                    console.log('d[yAx] is zero?', d[yAx] == 0);
                    return y(d[yAx]);
                })
                .attr("r", 3)
                .style("fill", "#00acee")
                .on("mouseover", function (d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html("@" + d["username"] + ": " + d["text"] + "<br/>" + "date: " + formatTime(d["date"]) + "<br/>" + "Likes: " + d[yAx])
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            //
            // function(d) {
            //     if(searchResults == null){return "#00acee"} //"#cc2400"
            //     for (var i = 0; i < searchResults.length; i++) {
            //         if (searchResults[i] != null && searchResults[i].getTime() === d.Date.getTime()) {
            //             return "#00acee";
            //         }
            //     }
            //     return "none";
            // })

            var scat = scatter
                .selectAll("circle");

            // scatter.exit()
            //     .remove()

            // Update chart when zooming
            function updateChart() {

                // Recover the new scale
                var newX = d3.event.transform.rescaleX(x);
                var newY = d3.event.transform.rescaleY(y);

                // Update axes with these new boundaries
                xAxis.call(d3.axisBottom(newX))
                yAxis.call(d3.axisLeft(newY))

                // Update circle position

                scat.attr('cx', function (d) {
                    return newX(d["date"])
                })
                    .attr('cy', function (d) {
                        return newY(d[yAx])
                    });
            }

            function zoomed() {
                var newX = d3.event.transform.rescaleX(x);
                var newY = d3.event.transform.rescaleY(y);
                xAxis.call(d3.axisBottom(newX).tickFormat(function (date) {
                    if (d3.event.transform.k == 1) {
                        return d3.timeFormat("%b %Y")(date);
                    } else {
                        return d3.timeFormat("%b %e, %Y")(date);
                    }
                }));
                scat.attr('cx', function (d) {
                    return newX(d["date"]);
                })
                    .attr('cy', function (d) {
                        return newY(d[yAx]);
                    });
            }
        })
    }


    drawCanvasScatters(filterResults, yAx, tweetsfile) {
        var margin = {top: 10, right: 30, bottom: 60, left: 80};
        var outerWidth = 900;
        var outerHeight = 500;
        var width = outerWidth - margin.left - margin.right;
        var height = outerHeight - margin.top - margin.bottom;
        
        
        const container = d3.select('.scatter-container')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', "0 0 " + width + " " + height);
        //container.style("width", '100%');
        let lastTransform = null;

        // Init SVG
        if(d3.select('#scatter-container svg g').size() == 0){
            var svgChart = container.append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)
                .attr('class', 'svg-plot')
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .attr('class', 'g-class')
                .attr('preserveAspectRatio', 'xMinYMin meet');
        }else{
            svgChart = d3.select('g-class')
        }


        // Init Canvas
        if(d3.select('#scatter-container canvas').size() == 0){
            var canvasChart = container.append('canvas')
                .attr('width', width)
                .attr('height', height)
                .style('margin-left', margin.left + 'px')
                .style('margin-top', margin.top + 'px')
                .attr('class', 'canvas-plot')
                //.style('display', 'none')
                .attr('preserveAspectRatio', 'xMinYMin meet');
            
            // hidden canvas
            var hiddenCanvas = //container.append('canvas')
            d3.select('#page2').append('canvas')
                .attr('width', width)
                .attr('height', height)
                .style('margin-left', margin.left + 'px')
                .style('margin-top', margin.top + 'px')
                //.style('display', 'none')
                .attr('class', 'hidden-canvas')
                .attr('preserveAspectRatio', 'xMinYMin meet');
        }else{
            canvasChart = d3.select('.canvas-plot');
            hiddenCanvas = d3.select('.hidden-canvas')
        }
        
        //let canv = canvasChart.node().getContext('2d');

        // "virtual" SVG for tooltip with canvas
        var customBase = document.createElement('custom');
        var custom = d3.select(customBase); 
        
        
        // map to track color the nodes.
        let colorToNode = new Map();
        let nodeToColor = new Map();
        // function to create new colors for picking
        let nextCol = 1;
        function genColor(){
            let ret = [];
            if (nextCol < 16777215){
                ret.push(nextCol & 0xff); //R
                ret.push((nextCol & 0xff00) >> 8); //G
                ret.push((nextCol & 0xff0000) >> 16); //B

                nextCol += 1;
            }
            let col = "rgb(" + ret.join(',') + ")";
            return col;
        }

        d3.json(tweetsfile).then((tweets) => {
            
            // Convert to Date format
            var parseTime = d3.timeParse("%m/%d/%y %H:%M");
            let data = [];
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
            let maxY = d3.max(data, function(d){
                return d[yAx];
            })
            var y = d3.scaleLog()
                // .domain([0, maxY])
                .domain(d3.extent(data, function(d){
                    return d[yAx];
                }))
                .range([height, 0])
                .nice();
            var yAxis = svgChart.append("g")
                .call(d3.axisLeft(y).tickFormat(d3.format(".0s")).ticks(5));

            // Text label for the x axis
            svgChart.append("text")
                .attr('x', `${width / 2}`)
                .attr('y', `${height + 50}`)
                .style("text-anchor", "middle")
                .style("font-family", "trebuchet ms")
                .text("Date");

            // Text label for the y axis
            svgChart.append("text")
                .attr('x', `-${height / 2}`)
                .attr('dy', '-3.5em')
                .attr('transform', 'rotate(-90)')
                .text(yAx)
                .style("text-anchor", "middle")
                .style("font-family", "trebuchet ms");

            databind(data, x, y);

            // Initial draw to visible canvas
            draw(d3.zoomIdentity, hiddenCanvas, true);
            draw(d3.zoomIdentity, canvasChart, false);




            d3.select('.canvas-plot').on('mousemove',function(){
                // draw(lastTransform, hiddenCanvas,true);
                // draw(lastTransform, canvasChart, false);
                
                var mouseX = d3.event.layerX || d3.event.offsetX;
                var mouseY = d3.event.layerY || d3.event.offsetY;

                var hiddenCtx = hiddenCanvas.node().getContext('2d');
                
                var col = hiddenCtx.getImageData(mouseX, mouseY, 1, 1,).data;
                //hiddenCtx.fillStyle = 'green';
                //hiddenCtx.fillRect(mouseX, mouseY, 1, 1);
                var colKey = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
                //console.log('col Key ' + "\"" + colKey + "\"")
                //console.log('existsw', colorToNode.has(colKey));
                //console.log('get that data' , colorToNode.colKey);
                
                var nodeData = colorToNode.get(colKey);
                //console.log("col to node" , colorToNode);
                //console.log("nodeData in the if ", nodeData);
                if (nodeData){
                    d3.select('#tooltip')
                        .style('opacity', 0.8)
                        .style('top', d3.event.pageY + 5 + 'px')
                        .style('left', d3.event.pageX + 5 + 'px')
                        .text('date ' + nodeData['date'] + 'rgb ' + colKey)
                        //.text("@" + nodeData["username"] + ": " + nodeData["text"] + " " + yAx + nodeData[yAx] + " date " + nodeData["date"]);
                } else {
                    d3.select('#tooltip')
                        .style('opacity', 0);
                }

            })

            
            function databind(data, x, y){ //x and y are the d3 axis
                data.sort(function(a, b){
                    return b['date']-a['date'];
                });
                
                data.forEach(function(d){
                    let myColor = genColor();
                    colorToNode.set(myColor, d);
                    
                    let myDataID = d['id'];
                    nodeToColor.set(myDataID, myColor);
                })
                
                //////// CUSTOM CIRCLE IMPLEMENTATION
                // var join = custom.selectAll('custom.circle')
                //             .data(data);
                //
                //
                //
                // var enterSel = join.enter()
                //         .append('custom')
                //         .attr('class', 'circle')
                //         // .attr('x', function(d){
                //         //     return x(d["date"]);
                //         // })
                //         // .attr('y', function(d){
                //         //     return y(d[yAx]);
                //         // }).attr("r", 2);
                //
                // join.merge(enterSel)
                //     //.transition()
                //     .attr('fillStyleHidden', function(d){
                //         //adds a key hiddenCol to the data and sets value to the generated RGB color. 
                //         //saves RGB:node mapping in colorToNode 
                //         //this RBG is filed in the "virtual SVG" as attr fillStyleHidden
                //         if (!d.hiddenCol){
                //             let myKey = genColor();
                //             console.log(colorToNode.has(myKey))
                //             d.hiddenCol = myKey;
                //             //let mykey = d.hiddenCol;
                //             colorToNode.set(myKey, d);
                //         }
                //         return d.hiddenCol;
                //     });
                //                  
            }
            
            function draw(transform, canvas, hidden) {
                
                /////////////// ZOOOOOOOOM STUFFFFFFFF
                lastTransform = transform;

                const scaleX = transform.rescaleX(x);
                const scaleY = transform.rescaleY(y);

                xAxis.call(d3.axisBottom(x).scale(scaleX));
                yAxis.call(d3.axisLeft(y).scale(scaleY).tickFormat(d3.format(".0s")).ticks(5));
                // var yAxis = svgChart.append("g")
                //     .call(d3.axisLeft(y).tickFormat(d3.format(".0s")).ticks(5));
                
                var can = canvas.node().getContext('2d');
                can.clearRect(0, 0, width, height);
                
                data.forEach(function(d){
                    let color = nodeToColor.get(d['id']);
                    can.fillStyle = hidden ? color : 'steelblue';
                    can.strokeStyle = hidden ? color : 'steelblue';
                    can.beginPath();
                    can.arc(scaleX(d['date']), scaleY(d[yAx]), 5, 0, 2*Math.PI);
                    can.fill();
                });
                
                // var elements = custom.selectAll('custom.circle'); //from the databind
                // elements.each(function(d) {
                //     var node = d3.select(this);
                //     can.fillStyle = hidden ? node.attr('fillStyleHidden') : 'steelblue';
                //     var theRGB =  node.attr('fillStyleHidden');
                //     var theData = colorToNode.get(theRGB);
                //
                //     can.beginPath();
                //     //can.arc(x(d['date']), y(d[yAx]), 2, 0, 2*Math.PI);
                //     can.arc(scaleX(d['date']), scaleY(d[yAx]), 2, 0, 2*Math.PI); //zoom version?
                //     can.fill();
                    
                    //drawPoint(can, scaleX, scaleY, d);
                //});
            }
            
            /////////////// ZOOOOOOOOM STUFFFFFFFF

            const zoom_function = d3.zoom().scaleExtent([1, 1000]).translateExtent([[0, 0], [width, height]])
                .on('zoom', () => {
                    let transform = d3.event.transform;
                    let context = canvasChart.node().getContext('2d');
                    let context2 = hiddenCanvas.node().getContext('2d');
                    
                    context.save();
                    context2.save();
                    draw(transform, canvasChart,false);
                    draw(transform, hiddenCanvas, true)
                    context.restore();
                    context2.restore();
                });
            canvasChart.call(zoom_function);
            
        })
    }
}

module.exports = TwitterScatter;