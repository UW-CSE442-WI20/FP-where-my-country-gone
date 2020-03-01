const d3 = require('d3');
const wordsToGraph = require('./WordToGraphID.json');
console.log(wordsToGraph);
class Network {
    constructor() {}

    drawNetworkGraph(word, since, until, politicians, sentiments) {
        let graphIdx = wordsToGraph[word];
        if (graphIdx == undefined) {
        } else {
            console.log("found graph index: " + graphIdx);
            let graphfile = 'wordnetwork' + graphIdx + '.json';
            console.log("graphfile found: " + graphfile);
            // const Data = require(graphfile);
            // d3.json(graphfile).then((data) => {
            //     d3.json('TweetsArray.json').then((tweetData) => {
            //         let edges = data[word];
            //         let keys = Object.keys(data[word]);
            //         let nodes = new Set();
            //         let links = [];
            //         keys.forEach(function (key) {
            //             let tweets = edges[key];
            //             nodes.add(word);
            //             for (let i = 0; i < tweets.length; i++) {
            //                 let valid = true;
            //                 let tweet = tweetData[tweets[i]];
            //                 let tweetDate = new Date(tweet["date"]);
            //                 if (tweetDate <= since || tweetDate >= until) {
            //                     valid = false;
            //                 } else if (politicians.has(tweet['username']) == false) {
            //                     valid = false;
            //                 } else if (sentiments.has(tweet['sentiment']) == false) {valid = false;
            //                 }

            //                 if (valid == true) {
            //                     nodes.add(key);
            //                     let link = {"source":word, "target":key};
            //                     links.push(link);
            //                 }
            //             }
            //         });
            //         this.drawNetwork(nodes, links);
            //     });
            // });
            d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then((data) => {
                this.drawNetwork(data.nodes, data.links);
            });
        }
    }

    drawNetwork(nodes, links) {
        console.log("NODES", nodes);
        console.log("LINKS", links);
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#GraphNetwork")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Initialize the links
        var link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
            .style("stroke", "#aaa")

        // Initialize the nodes
        var node = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
            .attr("r", 20)
            .style("fill", "#69b3a2")

        // Let's list the force we wanna apply on the network
        var simulation = d3.forceSimulation(nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
                .id(function(d) { return d.id; })                     // This provide  the id of a node
                .links(links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x+6; })
            .attr("cy", function(d) { return d.y-6; });
        }
        
    }

}

module.exports = Network;