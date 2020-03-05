// jQuery range sliders

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

// Add label to popularity display
$('input[type=radio]').on('change', function() {
    if (this.value !== "2016" && this.value !== "2020") {
        $('#dimension-type').text(this.value);
    }
});

// Make sidebar resizable
/*$("#sidenav").resizable({
    handles: 'e'
});*/