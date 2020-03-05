const d3 = require('d3');
class Network {
    constructor() {}

    drawNetworkGraph(word, since, until, politicians, sentiments, period) {
        var linkMap = {};
        var linkId = {};
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
                     let nextLink = {"source":word, "target":arr[i].word, "size":len};
                     links.push(nextLink);
                     /*
                     for (let j = 0; j < len; j++) {
                         let nextLink = {"source":word, "target":arr[i].word, "id" : links.length - 1};
                         links.push(nextLink);
                         if (linkMap[String(word)+String(arr[i].word)] != null) {
                            linkMap[String(word)+String(arr[i].word)]++;
                         } else {
                            linkMap[String(word)+String(arr[i].word)] = 1;
                         }
                        linkId[links.length - 1] = linkMap[String(word)+String(arr[i].word)];
                     }*/
                 }
                 console.log(nodes);
                 console.log(links);
                 this.drawNetwork(nodes, links, linkId);
             });
         });
    }

    drawNetwork(nodes, links, linkId) {
        console.log("NODES", nodes);
        console.log("LINKS", links);

        // Initialize canvas
        var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width,
        height = canvas.height;

        var graph = {nodes: nodes, links: links};

        var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

        simulation.nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links)
            .distance(200);

        d3.select(canvas)
            .call(d3.drag()
            .container(canvas)
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
        }
        
        function dragged(d) {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }
        
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        }
        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y);
        }
    
        function drawLink(d) {
            context.moveTo(d.source.x, d.source.y);
            // context.lineTo(d.target.x, d.target.y);
            var midX = (d.source.x + d.target.x) / 2,
                midY = (d.source.y + d.target.y) / 2;
            var factor = linkId[d.id] * 0.34;
            context.quadraticCurveTo(midX + factor, midY + factor, d.target.x, d.target.y);
        }
          
        function drawNode(d) {
            context.moveTo(d.x + 3, d.y);
            context.arc(d.x, d.y, 7, 0, 2 * Math.PI);
            context.fillText(d.id, d.x+11, d.y+5);
        }

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            context.clearRect(0, 0, width, height);

            context.beginPath();
            graph.links.forEach(drawLink);
            context.strokeStyle = "#aaa";
            context.stroke();
        
            context.beginPath();
            graph.nodes.forEach(drawNode);
            context.fill();
            context.strokeStyle = "#fff";
            context.stroke();
        }

    }

}

module.exports = Network;