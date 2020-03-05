// jQuery range sliders

// Initial view of popularity slider
$(function() {
    $("#slider-range1").slider({
        range: true,
        min: 0,
        max: 4385178,
        values: [0, 4385178],
        disabled: true,
    });
});

// Updated view of popularity slider after user selects a y-axis dimension
$('input[type=radio]').change(function() {
    if (this.value === "favorites") {
        $("#slider-range1").slider({
            range: true,
            min: 0,
            max: 4385178,
            values: [0, 4385178],
            disabled: false,
            slide: function(event, ui) {
                $("#pop-amount-start").val(ui.values[0]);
                $("#pop-amount-end").val(ui.values[1]);
            }
        });
        $("#pop-amount-start").val($("#slider-range1").slider("values", 0));
        $("#pop-amount-end").val($("#slider-range1").slider("values", 1));
    } else if (this.value === "retweets") {
        $("#slider-range1").slider({
            range: true,
            min: 0,
            max: 1591746,
            values: [0, 1591746],
            disabled: false,
            slide: function(event, ui) {
                $("#pop-amount-start").val(ui.values[0]);
                $("#pop-amount-end").val(ui.values[1]);
            }
        });
        $("#pop-amount-start").val($("#slider-range1").slider("values", 0));
        $("#pop-amount-end").val($("#slider-range1").slider("values", 1));
    } else if (this.value === "replies") {
        $("#slider-range1").slider({
            range: true,
            min: 0,
            max: 175977,
            values: [0, 175977],
            disabled: false,
            slide: function(event, ui) {
                $("#pop-amount-start").val(ui.values[0]);
                $("#pop-amount-end").val(ui.values[1]);
            }
        });
        $("#pop-amount-start").val($("#slider-range1").slider("values", 0));
        $("#pop-amount-end").val($("#slider-range1").slider("values", 1));
    }
});

// Initial view of Date slider
$(function() {
    $("#slider-range2").slider({
        range: true,
        min: new Date('2016.06.01').getTime() / 1000,
        max: new Date('2017.03.01').getTime() / 1000,
        values: [new Date('2016.06.01').getTime() / 1000, new Date('2017.03.01').getTime() / 1000],
        disabled: true,
    });
});

// Updated view of Date slider after user selects an election period
$('input[type=radio]').change(function() {
    if (this.value === "2016") {
        $("#slider-range2").slider({
            range: true,
            min: new Date('2016.06.01').getTime() / 1000,
            max: new Date('2017.03.31').getTime() / 1000,
            values: [new Date('2016.06.01').getTime() / 1000, new Date('2017.03.31').getTime() / 1000],
            disabled: false,
            slide: function(event, ui) {
                $("#date-amount-start").val((new Date(ui.values[0] * 1000)).toLocaleDateString("en-US"));
                $("#date-amount-end").val((new Date(ui.values[1] * 1000)).toLocaleDateString("en-US"));
            }
        });
        $("#date-amount-start").val((new Date($("#slider-range2").slider("values", 0) * 1000)).toLocaleDateString("en-US"));
        $("#date-amount-end").val((new Date($("#slider-range2").slider("values", 1) * 1000)).toLocaleDateString("en-US"));
    } else if (this.value === "2020") {
        $("#slider-range2").slider({
            range: true,
            min: new Date('2019.07.01').getTime() / 1000,
            max: new Date('2020.02.21').getTime() / 1000,
            values: [new Date('2019.07.01').getTime() / 1000, new Date('2020.02.21').getTime() / 1000],
            disabled: false,
            slide: function(event, ui) {
                $("#date-amount-start").val((new Date(ui.values[0] * 1000)).toLocaleDateString("en-US"));
                $("#date-amount-end").val((new Date(ui.values[1] * 1000)).toLocaleDateString("en-US"));
            }
        });
        $("#date-amount-start").val((new Date($("#slider-range2").slider("values", 0) * 1000)).toLocaleDateString("en-US"));
        $("#date-amount-end").val((new Date($("#slider-range2").slider("values", 1) * 1000)).toLocaleDateString("en-US"));
    }
});

$( "#sidenav" ).resizable({
    handles: 'e'
});