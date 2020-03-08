// You can require libraries
const d3 = require('d3');
const Network = require('./Network');
const TwitterScatter = require('./TwitterScatter');
const SummaryStats = require('./SummaryStats');
const networkInstance = new Network();
const twitterScatterInstance = new TwitterScatter();
const summaryStatsInstance = new SummaryStats();


let checked = new Set(['marcorubio', 'HillaryClinton', 'AOC', 'realDonaldTrump']);
let sentiments = new Set(['very pos', 'slight pos', 'neu', 'slight neg', 'very neg']);
networkInstance.drawNetworkGraph('trump', new Date('2019.7.1'), new Date('2020.02.20'),
    checked, sentiments, '2020', summaryStatsInstance);

/////////////////////
// Filtering
var dropdown = document.getElementsByClassName("dropdown-btn");
for (var i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}
/////////////////////

d3.select("#form")
    .on("submit", function() {
        d3.event.preventDefault();

        // Get checked boxes for Democrats/Republicans
        var checkedDems = [];
        var democrats = document.getElementsByClassName("dem");
        for (var i = 0; i < democrats.length; i++) {
            if (democrats[i].checked) {
                checkedDems.push(democrats[i].value);
            }
        }
        var checkedReps = [];
        var republicans = document.getElementsByClassName("rep");
        for (var i = 0; i < republicans.length; i++) {
            if (republicans[i].checked) {
                checkedReps.push(republicans[i].value);
            }
        }
        console.log("checkedDems : " + checkedDems);
        console.log("checkedRep: " + checkedReps);

        // Get checked boxes for sentiments
        var checkedSentiments = new Set();
        var sentiments = document.getElementsByClassName("sentiment");
        for (var i = 0; i < sentiments.length; i++) {
            if (sentiments[i].checked) {
                checkedSentiments.add(sentiments[i].value);
            }
        }
        console.log("checkedSentiments : " + checkedSentiments);

        // Get checked input for election period
        var checkedElectionPeriod;
        var electionPeriods = document.getElementsByName("election-period");
        for (var i = 0; i < electionPeriods.length; i++) {
            if (electionPeriods[i].checked) {
                checkedElectionPeriod = electionPeriods[i].value;
            }
        }
        console.log("checkedElectionPeriod : " + checkedElectionPeriod);

        // Get Date ranges
        var dateAmount = [document.getElementById("date-amount-start").value,
            document.getElementById("date-amount-end").value];
        console.log("Date range : " + dateAmount);

        // Get checked input for y-axis dimension choice
        var checkedYDimension;
        var yDimensions = document.getElementsByName("y-axis");
        for (var i = 0; i < yDimensions.length; i++) {
            if (yDimensions[i].checked) {
                checkedYDimension = yDimensions[i].value;
            }
        }
        console.log("checkedYDimension : " + checkedYDimension);

        var d1 = new Date(2016, 10, 1);
        var d2 = new Date(2020, 4, 4)
        twitterScatterInstance.drawTwitterScatter(checkedDems, checkedReps, d1.toString(),
            d2.toString(), checkedSentiments, "favorites", checkedElectionPeriod, summaryStatsInstance);
    });

/*
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


function tweetIntentToAnalytics (intentEvent) {
    if (!intentEvent) return;
    var label = "tweet";
    pageTracker._trackEvent(
        'twitter_web_intents',
        intentEvent.type,
        label
    );
}


// Wait for the asynchronous resources to load
twttr.ready(function (twttr) {
    // Now bind our custom intent events
    //twttr.events.bind('tweet', tweetIntentToAnalytics);
    twttr.widgets.createTweet(
        '20',
        document.getElementById('twittercontainer'),
        {
            theme: 'dark'
        }
    ).then( function( el ) {
        console.log('Tweet added.');
    });
    twttr.widgets.createTweet('21',
        document.getElementById('twittercontainer'),
        {
            theme: 'dark'
        })
});
/*
twttr.widgets.createTweet(
    '20',
    document.getElementById('twittercontainer'),
    {
        theme: 'dark'
    }
);*/

