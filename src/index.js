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

// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');


// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('carbon-emissions.csv')
    .then((data) => {
        console.log('Dynamically loaded CSV data', data);
    })

/////////////////////
// Filtering
let dropdown = document.getElementsByClassName("dropdown-btn");
for (let i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let dropdownContent = this.nextElementSibling;
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
        let checkedPeople = [];
        let democrats = document.getElementsByClassName("dem");
        for (let i = 0; i < democrats.length; i++) {
            if (democrats[i].checked) {
                checkedPeople.push(democrats[i].value);
            }
        }
        let republicans = document.getElementsByClassName("rep");
        for (let i = 0; i < republicans.length; i++) {
            if (republicans[i].checked) {
                checkedPeople.push(republicans[i].value);
            }
        }
        console.log(checkedPeople);

        // Get checked boxes for sentiments
        let checkedSentiments = [];
        let sentiments = document.getElementsByClassName("sentiment");
        for (let i = 0; i < sentiments.length; i++) {
            if (sentiments[i].checked) {
                checkedSentiments.push(sentiments[i].value);
            }
        }
        console.log(checkedSentiments);

        // Get popularity and Date amounts
        let popAmount = document.getElementById("pop-amount").value;
        let dateAmount = document.getElementById("date-amount").value;
        console.log(popAmount);
        console.log(dateAmount);
    });