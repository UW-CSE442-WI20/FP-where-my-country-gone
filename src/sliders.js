// jQuery range sliders
$(function() {
    $("#slider-range1").slider({
        range: true,
        min: 0,
        max: 4385178,
        values: [0, 4385178],
        slide: function(event, ui) {
            $("#fav-amount-start").val(ui.values[0]);
            $("#fav-amount-end").val(ui.values[1]);
        }
    });
    $("#fav-amount-start").val($("#slider-range1").slider("values", 0));
    $("#fav-amount-end").val($("#slider-range1").slider("values", 1));
});

$(function() {
    $("#slider-range3").slider({
        range: true,
        min: 0,
        max: 1591746,
        values: [0, 1591746],
        slide: function(event, ui) {
            $("#rt-amount-start").val(ui.values[0]);
            $("#rt-amount-end").val(ui.values[1]);
        }
    });
    $("#rt-amount-start").val($("#slider-range3").slider("values", 0));
    $("#rt-amount-end").val($("#slider-range3").slider("values", 1));
});

$(function() {
    $("#slider-range4").slider({
        range: true,
        min: 0,
        max: 175977,
        values: [0, 175977],
        slide: function(event, ui) {
            $("#replies-amount-start").val(ui.values[0]);
            $("#replies-amount-end").val(ui.values[1]);
        }
    });
    $("#replies-amount-start").val($("#slider-range4").slider("values", 0));
    $("#replies-amount-end").val($("#slider-range4").slider("values", 1));
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
} );

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
    } else {
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