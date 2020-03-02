// You can require libraries
const d3 = require('d3');

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();


const Network = require('./Network');
const networkInstance = new Network();
let checked = new Set(['marcorubio', 'RepMarkMeadows', 'AOC', 'BarackObama']);
let sentiments = new Set(['very pos', 'pos'])
networkInstance.drawNetworkGraph('trump', new Date('2016.1.1'), new Date('2020.02.20'),
    checked, sentiments);


const TwitterScatter = require('./TwitterScatter');
const twitterScatterInstance = new TwitterScatter();

twitterScatterInstance.drawTwitterScatter();

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

$( function() {
    $( "#slider-range1" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 200, 300 ],
        slide: function( event, ui ) {
            $( "#pop-amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
    });
    $( "#pop-amount" ).val( $( "#slider-range1" ).slider( "values", 0 ) +
        " - " + $( "#slider-range1" ).slider( "values", 1 ) );
} );

$( function() {
    $( "#slider-range2" ).slider({
        range: true,
        min: new Date('2016.01.01').getTime() / 1000,
        max: new Date('2020.01.01').getTime() / 1000,
        values: [new Date('2017.01.01').getTime() / 1000, new Date('2019.01.01').getTime() / 1000],
        slide: function( event, ui ) {
            $( "#date-amount" ).val( (new Date(ui.values[0] * 1000).toLocaleDateString("en-US")) + " - " + (new Date(ui.values[1] * 1000)).toLocaleDateString("en-US") );
        }
    });
    $("#date-amount").val((new Date($("#slider-range2").slider("values", 0) * 1000).toLocaleDateString("en-US")) +
        " - " + (new Date($("#slider-range2").slider("values", 1) * 1000)).toLocaleDateString("en-US"));
} );
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

        // Get popularity and Date amounts
        var popAmount = document.getElementById("pop-amount").value;
        var dateAmount = document.getElementById("date-amount").value;
        console.log(popAmount);
        console.log(dateAmount);
    });


