// You can require libraries
const d3 = require('d3');
const Network = require('./Network');
const TwitterScatter = require('./TwitterScatter');

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();



const networkInstance = new Network();
let checked = new Set(['marcorubio', 'RepMarkMeadows', 'AOC', 'BarackObama']);
let sentiments = new Set(['very pos', 'pos']);
networkInstance.drawNetworkGraph('trump', new Date('2016.1.1'), new Date('2020.02.20'),
    checked, sentiments);



const twitterScatterInstance = new TwitterScatter();
let democrats = ['BarackObama', 'AOC'];
let republicans = ['realDonaldTrump'];
twitterScatterInstance.drawTwitterScatter(democrats, republicans, new Date('2019.10.01'),
    new Date('2019.12.25'), sentiments, "favorites");

// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
// const exampleData = require('./example-data.json');


// // Anything you put in the static folder will be available
// // over the network, e.g.
// d3.csv('carbon-emissions.csv')
//   .then((data) => {
//     console.log('Dynamically loaded CSV data', data);
//   })

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
        var checkedPeople = [];
        var democrats = document.getElementsByClassName("dem");
        for (var i = 0; i < democrats.length; i++) {
            if (democrats[i].checked) {
                checkedPeople.push(democrats[i].value);
            }
        }
        var republicans = document.getElementsByClassName("rep");
        for (var i = 0; i < republicans.length; i++) {
            if (republicans[i].checked) {
                checkedPeople.push(republicans[i].value);
            }
        }
        console.log(checkedPeople);

        // Get checked boxes for sentiments
        var checkedSentiments = [];
        var sentiments = document.getElementsByClassName("sentiment");
        for (var i = 0; i < sentiments.length; i++) {
            if (sentiments[i].checked) {
                checkedSentiments.push(sentiments[i].value);
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
    });



