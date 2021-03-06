// You can require libraries
const d3 = require('d3');
const Network = require('./Network');
const TwitterScatter = require('./TwitterScatter');
const SummaryStats = require('./SummaryStats');
const networkInstance = new Network();
const twitterScatterInstance = new TwitterScatter();
const summaryStatsInstance = new SummaryStats();

// Initial view
var checkedDems = ['HillaryClinton'];
var checkedReps = ['realDonaldTrump'];
var checkedPeople = new Set(checkedDems.concat(checkedReps));
var checkedSentiments = new Set(['very pos', 'slight pos', 'neu', 'slight neg', 'very neg']);;
var checkedElectionPeriod = '2016';
var d1 = new Date(2016, 8, 1);
var d2 = new Date(2017, 1, 1);
var checkedYDimension = 'favorites';
var networkInput = 'america';
var scatterInput = '';

networkInstance.drawNetworkGraph(networkInput, d1, d2,
    checkedPeople, checkedSentiments, checkedElectionPeriod, summaryStatsInstance);

twitterScatterInstance.drawTwitterScatter(checkedDems, checkedReps,
    d1.toString(), d2.toString(), checkedSentiments, checkedYDimension, parseInt(checkedElectionPeriod), summaryStatsInstance);

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
// Filtering/search input
d3.select("#main-form")
    .on("submit", function() {
        d3.event.preventDefault();

        // Check that there has been at least one selection from each of the filtering options
        if ($('#dropdown-container-1 :checkbox:checked').length == 0 ||
            $('#dropdown-container-2 :checkbox:checked').length == 0 ||
            $('#dropdown-container-3 :radio:checked').length == 0) {
            alert("Please select at least one option from each of the filtering criteria.");
        } else {
            // Get checked boxes for Democrats/Republicans
            checkedDems = [];
            var democrats = document.getElementsByClassName("dem");
            for (var i = 0; i < democrats.length; i++) {
                if (democrats[i].checked) {
                    checkedDems.push(democrats[i].value);
                }
            }
            checkedReps = [];
            var republicans = document.getElementsByClassName("rep");
            for (var i = 0; i < republicans.length; i++) {
                if (republicans[i].checked) {
                    checkedReps.push(republicans[i].value);
                }
            }
            checkedPeople = new Set(checkedDems.concat(checkedReps));

            // Get checked boxes for sentiments
            checkedSentiments = new Set();
            var checkedSentimentsList = [];
            var sentiments = document.getElementsByClassName("sentiment");
            for (var i = 0; i < sentiments.length; i++) {
                if (sentiments[i].checked) {
                    checkedSentiments.add(sentiments[i].value);
                    checkedSentimentsList.push(sentiments[i].value);
                }
            }

            // Get checked input for election period
            var electionPeriods = document.getElementsByName("election-period");
            for (var i = 0; i < electionPeriods.length; i++) {
                if (electionPeriods[i].checked) {
                    checkedElectionPeriod = electionPeriods[i].value;
                }
            }

            // Get Date ranges
            var date1 = document.getElementById("date-amount-start").value;
            var date2 = document.getElementById("date-amount-end").value;
            d1 = new Date(date1);
            d2 = new Date(date2);

            // Confirm successful filtering
            printFiltering(checkedDems, checkedReps, checkedSentimentsList, checkedElectionPeriod, date1, date2);

            // Draw word network
            networkInstance.drawNetworkGraph(networkInput, d1, d2,
                checkedPeople, checkedSentiments, checkedElectionPeriod, summaryStatsInstance);

            // Draw scatterplot
            twitterScatterInstance.drawTwitterScatter(checkedDems, checkedReps,
                d1.toString(), d2.toString(), checkedSentiments, checkedYDimension, parseInt(checkedElectionPeriod), summaryStatsInstance);
        }
    });

function printFiltering(checkedDems, checkedReps, checkedSentimentsList, checkedElectionPeriod, date1, date2) {
    var dems = [];
    var reps = [];
    for (var i = 0; i < checkedDems.length; i++) {
        dems.push("@" + checkedDems[i]);
    }
    for (var i = 0; i < checkedReps.length; i++) {
        reps.push("@" + checkedReps[i]);
    }

    var result = "&nbsp;<b>Your filtering has been successfully completed!<br>&nbsp;Here are your selections:</b><br>";
    result += "&nbsp;<u>Democrat(s)</u>: " + dems + "<br>";
    result += "&nbsp;<u>Republican(s)</u>: " + reps + "<br>";
    result += "&nbsp;<u>Sentiment(s)</u>: " + checkedSentimentsList + "<br>";
    result += "&nbsp;<u>Election Period</u>: " + checkedElectionPeriod + "<br>";
    result += "&nbsp;<u>Date Range</u>: " + date1 + " - " + date2 + "<br>";
    result = result.replace(/,/g, ", ");
    document.getElementById("result").innerHTML = result;
}

d3.select("#network-form")
    .on("submit", function() {
        d3.event.preventDefault();

        // Get search input
        networkInput = document.getElementById("network-input").value;

        if (networkInput.indexOf(' ') >= 0) {
            var result = "Cannot search for multi-word inputs. Please try again!";
            document.getElementById("no-result-network").innerHTML = result;
        } else {
            // Draw word network
            document.getElementById("no-result-network").innerHTML = "";
            networkInstance.drawNetworkGraph(networkInput, d1, d2,
                checkedPeople, checkedSentiments, checkedElectionPeriod, summaryStatsInstance);
        }
    });

d3.select("#scatter-form")
    .on("submit", function() {
        d3.event.preventDefault();

        // Get search input
        scatterInput = document.getElementById("scatter-input").value;

        document.getElementById("no-result-scatter").innerHTML = "";
        // Draw scatterplot
        if (scatterInput === "") {
            twitterScatterInstance.drawTwitterScatter(checkedDems, checkedReps,
                d1.toString(), d2.toString(), checkedSentiments, checkedYDimension, parseInt(checkedElectionPeriod), summaryStatsInstance);
        } else {
            twitterScatterInstance.drawTwitterSearch(checkedPeople, d1, d2,
                checkedSentiments, checkedYDimension, checkedElectionPeriod, scatterInput, summaryStatsInstance);
        }
    });

d3.selectAll("input[name='y-axis']")
    .on("change", function() {
        // Get checked input for y-axis dimension choice
        var yDimensions = document.getElementsByName("y-axis");
        for (var i = 0; i < yDimensions.length; i++) {
            if (yDimensions[i].checked) {
                checkedYDimension = yDimensions[i].value;
            }
        }

        document.getElementById("no-result-scatter").innerHTML = "";
        // Draw scatterplot
        if (scatterInput === "") {
            twitterScatterInstance.drawTwitterScatter(checkedDems, checkedReps,
                d1.toString(), d2.toString(), checkedSentiments, checkedYDimension, parseInt(checkedElectionPeriod), summaryStatsInstance);
        } else {
            twitterScatterInstance.drawTwitterSearch(checkedPeople, d1, d2,
                checkedSentiments, checkedYDimension, checkedElectionPeriod, scatterInput, summaryStatsInstance);
        }
    });

d3.select("#option").on("click", function() {
    d3.event.preventDefault();
    summaryStatsInstance.updateData();
});

$( "#tooltipClick" )
    .tooltip({
        content: $( "#tooltipClick" ).attr( "title" ),
        items: 'span'
    })
    .off( "mouseover" )
    .on( "click", function(){
        $( this ).tooltip( "open" );
        return false;
    })
    .attr( "title", "" ).css({ cursor: "pointer" });

$( "#tooltipClick2" )
    .tooltip({
        content: $( "#tooltipClick2" ).attr( "title" ),
        items: 'span'
    })
    .off( "mouseover" )
    .on( "click", function(){
        $( this ).tooltip( "open" );
        return false;
    })
    .attr( "title", "" ).css({ cursor: "pointer" });

$( "#tooltipClick3" )
    .tooltip({
        content: $( "#tooltipClick3" ).attr( "title" ),
        items: 'span'
    })
    .off( "mouseover" )
    .on( "click", function(){
        $( this ).tooltip( "open" );
        return false;
    })
    .attr( "title", "" ).css({ cursor: "pointer" });

$( "#tooltipClick4" )
    .tooltip({
        content: $( "#tooltipClick4" ).attr( "title" ),
        items: 'span'
    })
    .off( "mouseover" )
    .on( "click", function(){
        $( this ).tooltip( "open" );
        return false;
    })
    .attr( "title", "" ).css({ cursor: "pointer" });

//var coll = document.getElementsByClassName("collapsible");
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}
/*
        <div class="content">
            <ol>
                <li>Select politicians to focus on.</li>
                <li>Select the sentiments that you prefer to include.</li>
                <li>Select an election period and a range of dates.</li>
                <li></li>
            </ol>
        </div>
 */
