// You can require libraries
const d3 = require('d3');
const Network = require('./Network');
const TwitterScatter = require('./TwitterScatter');

const networkInstance = new Network();
const twitterScatterInstance = new TwitterScatter();

let checked = new Set(['marcorubio', 'HillaryClinton']);
let sentiments = new Set(['very pos', 'slight pos', 'neu', 'slight neg', 'very neg']);
networkInstance.drawNetworkGraph('trump', new Date('2016.7.1'), new Date('2017.02.20'),
    checked, sentiments, '2016');

let democrats = ['BarackObama', 'AOC'];
let republicans = ['realDonaldTrump'];

twitterScatterInstance.drawTwitterScatter(democrats, republicans, new Date('2017.7.1'), new Date('2020.3.31'),
    sentiments, 'favorites', 2020);
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
        console.log(checkedSentiments);

        // Get checked input for election period
        var checkedElectionPeriod;
        var electionPeriods = document.getElementsByName("election-period");
        for (var i = 0; i < electionPeriods.length; i++) {
            if (electionPeriods[i].checked) {
                checkedElectionPeriod = electionPeriods[i].value;
            }
        }
        console.log(checkedElectionPeriod);

        // Get popularity and Date amounts
        var popAmount = [document.getElementById("pop-amount-start").value,
                         document.getElementById("pop-amount-end").value];
        var dateAmount = [document.getElementById("date-amount-start").value,
                         document.getElementById("date-amount-end").value];
        console.log(popAmount);
        console.log(dateAmount);

        twitterScatterInstance.drawTwitterScatter(checkedDems, checkedReps, new Date('2016.10.01'),
            new Date('2017.3.1'), checkedSentiments, "favorites", checkedElectionPeriod);
    });



