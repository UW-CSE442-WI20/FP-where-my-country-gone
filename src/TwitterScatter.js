const d3 = require('d3');
const dems = require('./democrats.json');
const repubs = require('./republicans.json');

class TwitterScatter {
    constructor() {
    }

    drawTwitterScatter(filterResults) {
        
        //preprocess the data
        //call drawScatter
        var tulsi = dems["TulsiGabbard"];
        this.drawScatter(tulsi);

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

    drawScatter(filterResults) { //filter results is an array of indexes which correlate with the tweetsarray index
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
                "translate(" + margin.left + "," + margin.top + ")");


        d3.json('TweetsArray.json').then((tweets) => {

            // Convert to Date format
            var parseTime = d3.timeParse("%m/%d/%y %H:%M");
            var data = [];
            for (var i = 0; i < filterResults.length; i++) {
                //data.push()
                //console.log(tweets[filterResults[i]]["text"]);
                tweets[filterResults[i]]["date"] = parseTime(tweets[filterResults[i]]["date"]);
                //console.log(" parsed " + parseTime(tweets[filterResults[i]]["date"]));
                //console.log(" saved parse" + tweets[filterResults[i]]["date"])
                //console.log("parsed " + parseTime("6/18/19 23:28"));
                data.push(tweets[filterResults[i]])
                //console.log(data)
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
                    return d["favorites"];
                }))
                .range([height - 20, 0]);
            var yAxis = svg.append("g")
                .call(d3.axisLeft(y));

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
                .attr("x", 0)
                .attr("y", 0);

            var scatter = svg.append('g')
                .attr("clip-path", "url(#clip)");


            //Add dots
            scatter.selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return x(d["date"]);
                })
                .attr("cy", function (d) {
                    return y(d["favorites"]);
                })
                .attr("r", 3)
                .style("fill", "#00acee")
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.text(d.Tweet_Text)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    div.transition()
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
                        return newY(d["favorites"])
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
                        return newY(d["favorites"]);
                    });
            }
        })
    }

    //copied from a3:
    a3drawScatter(filterResults, errFlag) {
        d3.csv(csvFile).then(function (data) {
            // Convert to Date format
            // data.forEach(function (d) {
            //     d.Date = parseTime(d.Date);
            // });

            if (errFlag) {
                d3.select("#err")
                    .style("opacity", 1);
            } else {
                d3.select("#err")
                    .style("opacity", 0);
            }


            // // Zoom feature
            // var zoom = d3.zoom()
            //     .scaleExtent([1, 20])
            //     //translateExtent insert bounds
            //     //or restrict zoom to one axis
            //     .translateExtent([[0, 0], [width, height]])
            //     .extent([[0, 0], [width, height]])
            //     .on("zoom", zoomed);

            //svg.call(zoom)

            // // Add X axis
            // var x = d3.scaleTime()
            //     .domain(d3.extent(data, function (d) {
            //         return d.Date;
            //     }))
            //     .range([0, width]);
            // var xAxis = svg.append("g")
            //     .attr("transform", "translate(0," + (height - 20) + ")")
            //     .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

            // // Add Y axis
            // var y = d3.scaleLinear()
            //     .domain([0, 20])
            //     .range([height - 20, 0]);
            // var yAxis = svg.append("g")
            //     .call(d3.axisLeft(y));

            // svg.append("rect")
            //     .attr("width", width)
            //     .attr("height", height)
            //     .style("fill", "none")
            //     .style("pointer-events", "all")
            //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            //     .call(zoom);

            // // Define the div for the tooltip
            // var div = d3.select("body")
            //     .append("div")
            //     .attr("class", "tooltip")
            //     .style("opacity", 0)
            //     .style("pointer-events", "none");

            // Add a clipPath: everything out of this area won't be drawn.
            // var clip = svg.append("defs").append("svg:clipPath")
            //     .attr("id", "clip")
            //     .append("svg:rect")
            //     .attr("width", width)
            //     .attr("height", height-20)
            //     .attr("x", 0)
            //     .attr("y", 0);
            //
            // var scatter = svg.append('g')
            //     .attr("clip-path", "url(#clip)");

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
                .text("Favorites");

            // //Add dots
            // scatter.selectAll("dot")
            //     .data(data)
            //     .enter()
            //     .append("circle")
            //     .attr("cx", function (d) {
            //         return x(d.Date);
            //     })
            //     .attr("cy", function (d) {
            //         return y(d.Popularity_log);
            //     })
            //     .attr("r", 3)
            //     .style("fill", function (d) {
            //         if (searchResults == null) {
            //             return "#00acee"
            //         } //"#cc2400"
            //         for (var i = 0; i < searchResults.length; i++) {
            //             if (searchResults[i] != null && searchResults[i].getTime() === d.Date.getTime()) {
            //                 return "#00acee";
            //             }
            //         }
            //         return "none";
            //     })
            //     .on("mouseover", function (d) {
            //         div.transition()
            //             .duration(200)
            //             .style("opacity", .9);
            //         div.text(d.Tweet_Text)
            //             .style("left", (d3.event.pageX) + "px")
            //             .style("top", (d3.event.pageY - 28) + "px");
            //     })
            //     .on("mouseout", function (d) {
            //         div.transition()
            //             .duration(500)
            //             .style("opacity", 0);
            //     });
            //
            // var scat = scatter
            //     .selectAll("circle");
            //
            // // Update chart when zooming
            // function updateChart() {
            //
            //     // Recover the new scale
            //     var newX = d3.event.transform.rescaleX(x);
            //     var newY = d3.event.transform.rescaleY(y);
            //
            //     // Update axes with these new boundaries
            //     xAxis.call(d3.axisBottom(newX))
            //     yAxis.call(d3.axisLeft(newY))
            //
            //     // Update circle position
            //
            //     scat.attr('cx', function (d) {
            //         return newX(d["date"]);
            //     })
            //         .attr('cy', function (d) {
            //             return newY(d["favorites"]); //Popularity_log)
            //         });
            // }
            //
            // function zoomed() {
            //     var newX = d3.event.transform.rescaleX(x);
            //     var newY = d3.event.transform.rescaleY(y);
            //     xAxis.call(d3.axisBottom(newX).tickFormat(function (date) {
            //         if (d3.event.transform.k == 1) {
            //             return d3.timeFormat("%b %Y")(date);
            //         } else {
            //             return d3.timeFormat("%b %e, %Y")(date);
            //         }
            //     }));
            //     scat.attr('cx', function (d) {
            //         return newX(d["date"]);
            //     })
            //         .attr('cy', function (d) {
            //             return newY(d["favorites"]);
            //         });
            // }
        });

    }
}
module.exports = TwitterScatter;