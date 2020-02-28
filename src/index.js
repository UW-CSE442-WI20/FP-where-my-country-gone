// You can require libraries
const d3 = require('d3');

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();


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
        min: 0,
        max: 500,
        values: [ 200, 300 ],
        slide: function( event, ui ) {
            $( "#date-amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
    });
    $( "#date-amount" ).val( $( "#slider-range2" ).slider( "values", 0 ) +
        " - " + $( "#slider-range2" ).slider( "values", 1 ) );
} );
/////////////////////

// Get user input
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
