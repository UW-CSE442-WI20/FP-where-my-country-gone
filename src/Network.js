const d3 = require('d3');
class Network {
    constructor() {}

    drawNetworkGraph(word, since, until, politicians, sentiments, period) {
        let graphfile;
        let tweetsfile;
        if (period === '2016') {
            graphfile = 'wordnetwork2016.json';
            tweetsfile = 'TweetsArray2016.json';
        } else {
            graphfile = 'wordnetwork.json';
            tweetsfile = 'TweetsArray.json';
        }
        console.log(since, until);
         d3.json(graphfile).then((data) => {
             d3.json(tweetsfile).then((tweetData) => {
                 if (data[word] == undefined) {
                     return;
                 }
                 let edges = data[word];
                 let keys = Object.keys(data[word]);
                 //let nodesSet = new Set();
                 let links = [];
                 let wordToNumber = new Map();
                 keys.forEach(function (key) {
                     let tweets = edges[key];
                     for (let i = 0; i < tweets.length; i++) {
                         let valid = true;
                         let tweet = tweetData[tweets[i]];
                         let tweetDate = new Date(tweet["date"]);
                         if (tweetDate <= since || tweetDate >= until) {
                             valid = false;
                         } else if (!politicians.has(tweet['username'])) {
                             valid = false;
                         } else if (!sentiments.has(tweet['sentiment'])) {
                             valid = false;
                         }
                         if (valid) {
                             if (!wordToNumber.has(key)) {
                                 wordToNumber.set(key, 0);
                             }
                             wordToNumber.set(key, wordToNumber.get(key) + 1);
                         }
                     }
                 });
                 let mapIter = wordToNumber.keys();
                 let key = mapIter.next();
                 let arr = [];
                 while (!key.done) {
                     let keyItself = key.value;
                     let next = {"word":keyItself, "number":wordToNumber.get(keyItself)};
                     arr.push(next);
                     key = mapIter.next();
                 }
                 arr.sort(function(a, b){return a.number - b.number});
                 arr.reverse();
                 let nodes = [];
                 nodes.push({"id":word});
                 for (let i = 0; i < 20; i++) {
                     let nextNode = {"id":arr[i].word};
                     nodes.push(nextNode);
                     let len = arr[i].number;
                     for (let j = 0; j < len; j++) {
                         let nextLink = {"source":word, "target":arr[i].word};
                         links.push(nextLink);
                     }
                 }
                 console.log(nodes);
                 console.log(links);
                 this.drawNetwork(nodes, links);
             });
         });
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