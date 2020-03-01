const d3 = require('d3');
const wordsToGraph = require('./WordToGraphID.json');
class Network {
    constructor() {}

    drawNetworkGraph(word, since, until, politicians, sentiments) {
        let graphIdx = wordsToGraph[word];
        if (graphIdx == undefined) {
        } else {
            let graphfile = 'wordnetwork' + graphIdx + '.json';
            d3.json(graphfile).then((data) => {
                d3.json('TweetsArray.json').then((tweetData) => {
                    let edges = data[word];
                    let keys = Object.keys(data[word]);
                    let nodes = new Set();
                    let links = [];
                    keys.forEach(function (key) {
                        let tweets = edges[key];
                        nodes.add(word);
                        for (let i = 0; i < tweets.length; i++) {
                            let valid = true;
                            let tweet = tweetData[tweets[i]];
                            let tweetDate = new Date(tweet["date"]);
                            if (tweetDate <= since || tweetDate >= until) {
                                valid = false;
                            } else if (politicians.has(tweet['username']) == false) {
                                valid = false;
                            } else if (sentiments.has(tweet['sentiment']) == false) {valid = false;
                            }

                            if (valid == true) {
                                nodes.add(key);
                                let link = {"source":word, "target":key};
                                links.push(link);
                            }
                        }
                    });
                    this.drawNetwork(nodes, links);
                });
            });
        }
    }

    drawNetwork(nodes, links) {
        console.log(nodes);
        console.log(links);
    }

}

module.exports = Network;