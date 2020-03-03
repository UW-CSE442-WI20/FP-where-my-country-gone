const d3 = require('d3');

class TwitterScatter {
    constructor() {
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
        //preprocess the data
        //call drawScatter
        let indexes = [];
        let intermmediate = [];
        let tmp;
        let dems;
        let repubs;
        let tweetsfile;
        if (period === '2016') {
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
                    continue;
                } else if (!sentiments.has(nextTweet['sentiment'])) {
                    continue;
                }
                indexes.push(intermmediate[i]);
            }
            console.log(indexes);
            console.log("yax " + yAxis);
            this.drawScatter(indexes, yAxis, tweetsfile);
            
        });

    }

// {
//     "date":"6/18/19 23:54",
//     "username":"realDonaldTrump",
//     "replies":8636,
//     "retweets":8012,
//     "favorites":49104,
//     "text":"Join me LIVE tonight in Orlando, Florida at 8:00 P.M. Eastern as we kickoff #Trump2020. Enjoy!",
//     "permalink":"https://twitter.com/realDonaldTrump/status/1141132100273418240",
//     "sentiment":"very pos"
// }

    drawScatter(filterResults, yAx, tweetsfile) { //filter results is an array of indexes which correlate with the tweetsarray index
        var yAxis = yAx;
        console.log(" in draw" + yAx)
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 1100 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        var wid = width + margin.left + margin.right;
        var hei = height + margin.top + margin.bottom;
        var svg = d3.select("#dataviz")
            .append("svg")
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', "0 0 " + wid + " " + hei)
            //.attr("width", width + margin.left + margin.right)
            //.attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + (margin.left + 30) + "," + margin.top + ")");

    
        d3.json(tweetsfile).then((tweets) => {
            console.log("in json " + yAxis)
            // Convert to Date format
            var parseTime = d3.timeParse("%m/%d/%y %H:%M");
            var data = [];
            var vals = []
            for (var i = 0; i < filterResults.length; i++) {
                tweets[filterResults[i]]["date"] = parseTime(tweets[filterResults[i]]["date"]);
                data.push(tweets[filterResults[i]])
                //console.log([data[i]["favorites"]]);
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
                    return d[yAxis];
                }))
                .range([height - 20, 0]);
            var yAxis = svg.append("g")
                .attr("transform", "translate(10,0)")
                .call(d3.axisLeft(y));

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
                .text("??");

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
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
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
                    return y(d[yAxis]);
                })
                .attr("r", 3)
                .style("fill", "#00acee")
                .on("mouseover", function (d) {
                    console.log('fjdksl')
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html("@" + d["username"] + ": " + d["text"] + "<br/>" + "date: " + formatTime(d["date"]) + "<br/>" + "Likes: " + d[yAxis])
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
                        return newY(d[yAxis])
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
                        return newY(d[yAxis]);
                    });
            }
        })
    }

}
module.exports = TwitterScatter;