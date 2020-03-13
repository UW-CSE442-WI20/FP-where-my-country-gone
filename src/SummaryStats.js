const d3 = require('d3');

class SummaryStats {
    //twttr;
    constructor() {
        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {

                t._e.push(f);
            };

            return t;
        }(document, "script", "twitter-wjs"));
        this.piedataset_;
        this.interactiondataset_;
        this.sentimentdataset_;

    }


    updateData() {
        d3.select("#pieChart").selectAll("*").remove();
        d3.select("#sentimentChart").selectAll("*").remove();
        d3.select("#interactionChart").selectAll("*").remove();
        this.drawSummaries(this.piedataset_, this.sentimentdataset_, this.interactiondataset_);
    }
    drawStats(indexes, tweetsfile) {
        console.log(indexes);
        d3.json(tweetsfile).then((tweets) => {
            let userToNumberOfTweets = new Map();
            let userToSentiment = new Map();
            let userToInteractions = new Map();
            let totaltweets = indexes.length;
            let idToPopularity = [];
            let overallsentiments = {"very neg":0, "slight neg":0, "neu":0, "slight pos":0, "very pos":0};
            let overallinteractions = {"replies":0, "retweets":0, "favorites":0};
            for (let i = 0; i < indexes.length; i++) {
                let tweet = tweets[indexes[i]];
                let popularity = tweet['replies'] + tweet['favorites'] + tweet['retweets'];
                let popelement = {"id":tweet['id'], "popularity":popularity};
                idToPopularity.push(popelement);
                let username = tweet['username'];
                if (!userToNumberOfTweets.has(username)) {
                    userToNumberOfTweets.set(username, 0);
                    let sentiments = {"very neg":0, "slight neg":0, "neu":0, "slight pos":0, "very pos":0};
                    userToSentiment.set(username, sentiments);
                    let interactions = {"replies":0, "retweets":0, "favorites":0};
                    userToInteractions.set(username, interactions);
                }
                userToNumberOfTweets.set(username, userToNumberOfTweets.get(username) + 1);

                let nextsentiments = userToSentiment.get(username);
                nextsentiments[tweet['sentiment']] = nextsentiments[tweet['sentiment']] + 1;
                overallsentiments[tweet['sentiment']] = overallsentiments[tweet['sentiment']] + 1;
                userToSentiment.set(username, nextsentiments);

                let nextinteractions = userToInteractions.get(username);
                nextinteractions['replies'] = nextinteractions['replies'] + tweet['replies'];
                nextinteractions['retweets'] = nextinteractions['retweets'] + tweet['retweets'];
                nextinteractions['favorites'] = nextinteractions['favorites'] + tweet['favorites'];

                overallinteractions['replies'] = overallinteractions['replies'] + tweet['replies'];
                overallinteractions['retweets'] = overallinteractions['retweets'] + tweet['retweets'];
                overallinteractions['favorites'] = overallinteractions['favorites'] + tweet['favorites'];

                userToInteractions.set(username, nextinteractions);
            }
            console.log(idToPopularity);
            idToPopularity.sort(function(a, b){return a.popularity - b.popularity});
            idToPopularity.reverse();
            let piedataset = [];
            let sentimentdataset = [];
            let interactiondataset = [];
            let mapIter = userToNumberOfTweets.keys();
            let key = mapIter.next();

            sentimentdataset.push({group:"All", category:"very neg", measure:overallsentiments['very neg']});
            sentimentdataset.push({group:"All", category:"slight neg", measure:overallsentiments['slight neg']});
            sentimentdataset.push({group:"All", category:"neu", measure:overallsentiments['neu']});
            sentimentdataset.push({group:"All", category:"slight pos", measure:overallsentiments['slight pos']});
            sentimentdataset.push({group:"All", category:"very pos", measure:overallsentiments['very pos']});

            interactiondataset.push({group:"All", category:"replies", measure:overallinteractions['replies']});
            interactiondataset.push({group:"All", category:"retweets", measure:overallinteractions['retweets']});
            interactiondataset.push({group:"All", category:"favorites", measure:overallinteractions['favorites']});

            while(!key.done) {
                let keyitself = key.value;
                let measurev = userToNumberOfTweets.get(keyitself) / totaltweets;
                let nextpie = {category:keyitself, measure:measurev};
                piedataset.push(nextpie);

                let nextsentiments = userToSentiment.get(keyitself);
                sentimentdataset.push({group:keyitself, category:"very neg", measure:nextsentiments['very neg']});
                sentimentdataset.push({group:keyitself, category:"slight neg", measure:nextsentiments['slight neg']});
                sentimentdataset.push({group:keyitself, category:"neu", measure:nextsentiments['neu']});
                sentimentdataset.push({group:keyitself, category:"slight pos", measure:nextsentiments['slight pos']});
                sentimentdataset.push({group:keyitself, category:"very pos", measure:nextsentiments['very pos']});

                let nextinteractions = userToInteractions.get(keyitself);
                interactiondataset.push({group:keyitself, category:"replies", measure:nextinteractions['replies']});
                interactiondataset.push({group:keyitself, category:"retweets", measure:nextinteractions['retweets']});
                interactiondataset.push({group:keyitself, category:"favorites", measure:nextinteractions['favorites']});
                key = mapIter.next();
            }
            let toptweets = [];
            console.log(idToPopularity);
            for (let i = 0; i < 10 && i < idToPopularity.length; i++) {
                toptweets.push(idToPopularity[i].id);
            }
            //console.log(d3.select("#pieChart").selectAll("*"));
            d3.select("#pieChart").selectAll("*").remove();
            d3.select("#sentimentChart").selectAll("*").remove();
            d3.select("#interactionChart").selectAll("*").remove();
            d3.select("#twittercontainer").selectAll("*").remove();

            this.piedataset_ = piedataset;
            this.sentimentdataset_ = sentimentdataset;
            this.interactiondataset_ = interactiondataset;

            this.drawSummaries(piedataset, sentimentdataset, interactiondataset);
            this.showTweets(toptweets);

            // this.drawPie(piedataset);
            // this.dsBarChart("All", sentimentdataset);
        });
    }

    drawSummaries(piedataset, sentimentdataset, interactiondataset) {
        var 	formatAsPercentage = d3.format("%"),
            formatAsPercentage1Dec = d3.format(".1%"),
            formatAsInteger = d3.format(","),
            fsec = d3.timeFormat("%S s"),
            fmin = d3.timeFormat("%M m"),
            fhou = d3.timeFormat("%H h"),
            fwee = d3.timeFormat("%a"),
            fdat = d3.timeFormat("%d d"),
            fmon = d3.timeFormat("%b")
        ;
        //d3.selectAll("g > *").remove();
        //svg.selectAll("*").remove();
        function drawPie() {
            var width = 350;
            var height = 350;
            var outerRadius = Math.min(width, height) / 2;
            var innerRadius = outerRadius * .999;
            // for animation
            var innerRadiusFinal = outerRadius * .5;
            var innerRadiusFinal3 = outerRadius* .45;
            var color = d3.scaleOrdinal()
                .range(["#1f77b4", "#aec7e8",
                    "#ff7f0e", "#ffbb78",
                    "#2ca02c", "#98df8a",
                    "#d62728", "#ff9896",
                    "#9467bd", "#c5b0d5",
                    "#8c564b", "#c49c94",
                    "#e377c2", "#f7b6d2",
                    "#7f7f7f", "#c7c7c7",
                    "#bcbd22", "#dbdb8d",
                    "#17becf", "#9edae5"]);
            var vis = d3.select("#pieChart")
                .append("svg:svg")              //create the SVG element inside the <body>
                .data([piedataset])                   //associate our data with the document
                .attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", height)
                .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
            ;

            var arc = d3.arc()              //this will create <path> elements for us using arc data
                .outerRadius(outerRadius).innerRadius(innerRadius);

            // for animation
            var arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
            var arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

            var pie = d3.pie()           //this will create arc data for us given a list of values
                .value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

            var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
                .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice")    //allow us to style things in the slices (like text)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .on("click", up)
            ;

            arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
                .append("svg:title") //mouseover title showing the figures
                .text(function(d) { return d.data.category + ": " + formatAsPercentage(d.data.measure); });

            d3.selectAll("g.slice").selectAll("path").transition()
                .duration(750)
                .delay(10)
                .attr("d", arcFinal )
            ;

            // Add a label to the larger arcs, translated to the arc centroid and rotated.
            // source: http://bl.ocks.org/1305337#index.html
            arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
                .append("svg:text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
                //.text(function(d) { return formatAsPercentage(d.value); })
                .text(function(d) { return d.data.category; })
            ;

            // Computes the label angle of an arc, converting from radians to degrees.
            function angle(d) {
                var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
                return a > 90 ? a - 180 : a;
            }


            // Pie chart title
            vis.append("svg:text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text("Tweets Share")
                .attr("class","title")
            ;



            function mouseover() {
                d3.select(this).select("path").transition()
                    .duration(750)
                    //.attr("stroke","red")
                    //.attr("stroke-width", 1.5)
                    .attr("d", arcFinal3)
                ;
            }

            function mouseout() {
                d3.select(this).select("path").transition()
                    .duration(750)
                    //.attr("stroke","blue")
                    //.attr("stroke-width", 1.5)
                    .attr("d", arcFinal)
                ;
            }
            function up(d, i) {

                /* update bar chart when user selects piece of the pie chart */
                //updateBarChart(dataset[i].category);
                let category = d.data.category;
                let colorx = color(i);
                updateInteractionsChart(category, colorx);
                updateSentimentChart(category, colorx);
                //updateInteractionsChart(d.data.category, color(i));
            }
        }

        drawPie();

        var group = "All";

        function datasetBarChosen(group) {
            var ds = [];
            for (x in sentimentdataset) {
                if(sentimentdataset[x].group==group){
                    ds.push(sentimentdataset[x]);
                }
            }
            return ds;
        }


        function dsBarChartBasics() {

            var margin = {top: 30, right: 5, bottom: 20, left: 50},
                width = 350 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom,
                colorBar = d3.schemeDark2,
                barPadding = 1
            ;

            return {
                margin : margin,
                width : width,
                height : height,
                colorBar : colorBar,
                barPadding : barPadding
            }
                ;
        }

        function dsBarChart() {
            var firstDatasetBarChart = datasetBarChosen(group);

            var basics = dsBarChartBasics();

            var margin = basics.margin,
                width = basics.width,
                height = basics.height,
                colorBar = basics.colorBar,
                barPadding = basics.barPadding
            ;

            var 	xScale = d3.scaleLinear()
                .domain([0, firstDatasetBarChart.length])
                .range([0, width])
            ;
            var maximumY = d3.max(firstDatasetBarChart, function(d) {
                return d.measure;
            });
            // Create linear y scale
            // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
            // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.
            var yScale = d3.scaleLinear()
                // use the max funtion to derive end point of the domain (max value of the dataset)
                // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
                    .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])
                    // As coordinates are always defined from the top left corner, the y position of the bar
                    // is the svg height minus the data value. So you basically draw the bar starting from the top.
                    // To have the y position calculated by the range function
                    .range([height, 0])
            ;

            //Create SVG element

            var svg = d3.select("#sentimentChart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id","barChartPlot")
            ;

            var plot = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;

            plot.selectAll("rect")
                .data(firstDatasetBarChart)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {
                    return xScale(i);
                })
                .attr("width", width / firstDatasetBarChart.length - barPadding)
                .attr("y", function(d) {
                    return yScale(d.measure);
                })
                .attr("height", function(d) {
                    return height-yScale(d.measure);
                })
                .attr("fill", "lightgrey")
            ;


            // Add y labels to plot

            plot.selectAll("text")
                .data(firstDatasetBarChart)
                .enter()
                .append("text")
                .text(function(d) {
                    return formatAsInteger(d.measure);
                })
                .attr("text-anchor", "middle")
                // Set x position to the left edge of each bar plus half the bar width
                .attr("x", function(d, i) {
                    return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
                })
                .attr("y", function(d) {
                    return yScale(d.measure) + 14;
                })
                .attr("class", "yAxis")
            /* moved to CSS
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white")
            */
            ;

            // Add x labels to chart

            var xLabels = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
            ;

            xLabels.selectAll("text.xAxis")
                .data(firstDatasetBarChart)
                .enter()
                .append("text")
                .text(function(d) { return d.category;})
                .attr("text-anchor", "middle")
                // Set x position to the left edge of each bar plus half the bar width
                .attr("x", function(d, i) {
                    return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
                })
                .attr("y", 15)
                .attr("class", "xAxis")
            //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
            ;

            // Title

            svg.append("text")
                .attr("x", (width + margin.left + margin.right)/2)
                .attr("y", 15)
                .attr("class","title")
                .attr("text-anchor", "middle")
                .text("Sentiment Analysis Distribution")
            ;
        }

        dsBarChart();

        function updateSentimentChart(group, colorChosen) {

            var currentDatasetBarChart = datasetBarChosen(group);

            var basics = dsBarChartBasics();

            var margin = basics.margin,
                width = basics.width,
                height = basics.height,
                colorBar = basics.colorBar,
                barPadding = basics.barPadding
            ;

            var 	xScale = d3.scaleLinear()
                .domain([0, currentDatasetBarChart.length])
                .range([0, width])
            ;


            var yScale = d3.scaleLinear()
                .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
                .range([height,0])
            ;

            var svg = d3.select("#sentimentChart svg");

            var plot = d3.select("#barChartPlot")
                .datum(currentDatasetBarChart)
            ;

            /* Note that here we only have to select the elements - no more appending! */
            plot.selectAll("rect")
                .data(currentDatasetBarChart)
                .transition()
                .duration(750)
                .attr("x", function(d, i) {
                    return xScale(i);
                })
                .attr("width", width / currentDatasetBarChart.length - barPadding)
                .attr("y", function(d) {
                    return yScale(d.measure);
                })
                .attr("height", function(d) {
                    return height-yScale(d.measure);
                })
                .attr("fill", colorChosen)
            ;

            plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
                .data(currentDatasetBarChart)
                .transition()
                .duration(750)
                .attr("text-anchor", "middle")
                .attr("x", function(d, i) {
                    return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
                })
                .attr("y", function(d) {
                    return yScale(d.measure) + 14;
                })
                .text(function(d) {
                    return formatAsInteger(d.measure);
                })
                .attr("class", "yAxis")
            ;


            svg.selectAll("text.title") // target the text element(s) which has a title class defined
                .attr("x", (width + margin.left + margin.right)/2)
                .attr("y", 15)
                .attr("class","title")
                .attr("text-anchor", "middle")
                .text(group + "'s Sentiment Analysis Breakdown")
            ;
        }

        function interactiondatasetBarChosen(group) {
            var ds = [];
            for (x in interactiondataset) {
                if(interactiondataset[x].group==group){
                    ds.push(interactiondataset[x]);
                }
            }
            return ds;
        }


        function interactiondsBarChartBasics() {

            var margin = {top: 30, right: 5, bottom: 20, left: 45},
                width = 350 - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom,
                colorBar = d3.schemeDark2,
                barPadding = 1
            ;

            return {
                margin : margin,
                width : width,
                height : height,
                colorBar : colorBar,
                barPadding : barPadding
            }
                ;
        }

        function interactiondsBarChart() {
            var firstDatasetBarChart = interactiondatasetBarChosen(group);

            var basics = interactiondsBarChartBasics();

            var margin = basics.margin,
                width = basics.width,
                height = basics.height,
                colorBar = basics.colorBar,
                barPadding = basics.barPadding
            ;

            var 	xScale = d3.scaleLinear()
                .domain([0, firstDatasetBarChart.length])
                .range([0, width])
            ;

            // Create linear y scale
            // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
            // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.
            var yScale = d3.scaleLinear()
                // use the max funtion to derive end point of the domain (max value of the dataset)
                // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
                    .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])
                    // As coordinates are always defined from the top left corner, the y position of the bar
                    // is the svg height minus the data value. So you basically draw the bar starting from the top.
                    // To have the y position calculated by the range function
                    .range([height, 0])
            ;

            //Create SVG element

            var svg = d3.select("#interactionChart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id","interactionChartPlot")
            ;

            var plot = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            ;

            plot.selectAll("rect")
                .data(firstDatasetBarChart)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {
                    return xScale(i);
                })
                .attr("width", width / firstDatasetBarChart.length - barPadding)
                .attr("y", function(d) {
                    return yScale(d.measure);
                })
                .attr("height", function(d) {
                    return height-yScale(d.measure);
                })
                .attr("fill", "lightgrey")
            ;


            // Add y labels to plot

            plot.selectAll("text")
                .data(firstDatasetBarChart)
                .enter()
                .append("text")
                .text(function(d) {
                    return formatAsInteger(d.measure);
                })
                .attr("text-anchor", "middle")
                // Set x position to the left edge of each bar plus half the bar width
                .attr("x", function(d, i) {
                    return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
                })
                .attr("y", function(d) {
                    return yScale(d.measure) + 14;
                })
                .attr("class", "yAxis")
            /* moved to CSS
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white")
            */
            ;

            // Add x labels to chart

            var xLabels = svg
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
            ;

            xLabels.selectAll("text.xAxis")
                .data(firstDatasetBarChart)
                .enter()
                .append("text")
                .text(function(d) { return d.category;})
                .attr("text-anchor", "middle")
                // Set x position to the left edge of each bar plus half the bar width
                .attr("x", function(d, i) {
                    return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
                })
                .attr("y", 15)
                .attr("class", "xAxis")
            //.attr("style", "font-size: 12; font-family: Helvetica, sans-serif")
            ;

            // Title

            svg.append("text")
                .attr("x", (width + margin.left + margin.right)/2)
                .attr("y", 15)
                .attr("class","title")
                .attr("text-anchor", "middle")
                .text("Interaction Overall Distribution")
            ;
        }

        interactiondsBarChart();
        function updateInteractionsChart(group, colorChosen) {

            var currentDatasetBarChart = interactiondatasetBarChosen(group);

            var basics = interactiondsBarChartBasics();

            var margin = basics.margin,
                width = basics.width,
                height = basics.height,
                colorBar = basics.colorBar,
                barPadding = basics.barPadding
            ;

            var 	xScale = d3.scaleLinear()
                .domain([0, currentDatasetBarChart.length])
                .range([0, width])
            ;


            var yScale = d3.scaleLinear()
                .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
                .range([height,0])
            ;

            var svg = d3.select("#interactionChart svg");

            var plot = d3.select("#interactionChartPlot")
                .datum(currentDatasetBarChart)
            ;

            /* Note that here we only have to select the elements - no more appending! */
            plot.selectAll("rect")
                .data(currentDatasetBarChart)
                .transition()
                .duration(750)
                .attr("x", function(d, i) {
                    return xScale(i);
                })
                .attr("width", width / currentDatasetBarChart.length - barPadding)
                .attr("y", function(d) {
                    return yScale(d.measure);
                })
                .attr("height", function(d) {
                    return height-yScale(d.measure);
                })
                .attr("fill", colorChosen)
            ;

            plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
                .data(currentDatasetBarChart)
                .transition()
                .duration(750)
                .attr("text-anchor", "middle")
                .attr("x", function(d, i) {
                    return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);
                })
                .attr("y", function(d) {
                    return yScale(d.measure) + 14;
                })
                .text(function(d) {
                    return formatAsInteger(d.measure);
                })
                .attr("class", "yAxis")
            ;


            svg.selectAll("text.title") // target the text element(s) which has a title class defined
                .attr("x", (width + margin.left + margin.right)/2)
                .attr("y", 15)
                .attr("class","title")
                .attr("text-anchor", "middle")
                .text(group + "'s Interactions Breakdown")
            ;
        }

    }


    showTweets(toptweets) {
        console.log(toptweets);
// Wait for the asynchronous resources to load
        twttr.ready(function (twttr) {
            // Now bind our custom intent events
            //twttr.events.bind('tweet', tweetIntentToAnalytics);
            for (let i = 0; i < toptweets.length; i++) {
                twttr.widgets.createTweet(toptweets[i],
                    document.getElementById('twittercontainer'),
                    {
                        theme: 'light'
                    }).then(function( el ) {
                    console.log('Tweet added.');
                });
            }
        });
    }


}

module.exports = SummaryStats;