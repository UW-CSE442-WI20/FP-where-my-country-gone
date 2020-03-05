// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"d0Si":[function(require,module,exports) {
// jQuery range sliders
// Initial view of popularity slider
$(function () {
  $("#slider-range1").slider({
    range: true,
    min: 0,
    max: 4385178,
    values: [0, 4385178],
    disabled: true
  });
}); // Updated view of popularity slider after user selects a y-axis dimension

$('input[type=radio]').change(function () {
  if (this.value === "favorites") {
    $("#slider-range1").slider({
      range: true,
      min: 0,
      max: 4385178,
      values: [0, 4385178],
      disabled: false,
      slide: function slide(event, ui) {
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
      slide: function slide(event, ui) {
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
      slide: function slide(event, ui) {
        $("#pop-amount-start").val(ui.values[0]);
        $("#pop-amount-end").val(ui.values[1]);
      }
    });
    $("#pop-amount-start").val($("#slider-range1").slider("values", 0));
    $("#pop-amount-end").val($("#slider-range1").slider("values", 1));
  }
}); // Initial view of Date slider

$(function () {
  $("#slider-range2").slider({
    range: true,
    min: new Date('2016.06.01').getTime() / 1000,
    max: new Date('2017.03.01').getTime() / 1000,
    values: [new Date('2016.06.01').getTime() / 1000, new Date('2017.03.01').getTime() / 1000],
    disabled: true
  });
}); // Updated view of Date slider after user selects an election period

$('input[type=radio]').change(function () {
  if (this.value === "2016") {
    $("#slider-range2").slider({
      range: true,
      min: new Date('2016.06.01').getTime() / 1000,
      max: new Date('2017.03.31').getTime() / 1000,
      values: [new Date('2016.06.01').getTime() / 1000, new Date('2017.03.31').getTime() / 1000],
      disabled: false,
      slide: function slide(event, ui) {
        $("#date-amount-start").val(new Date(ui.values[0] * 1000).toLocaleDateString("en-US"));
        $("#date-amount-end").val(new Date(ui.values[1] * 1000).toLocaleDateString("en-US"));
      }
    });
    $("#date-amount-start").val(new Date($("#slider-range2").slider("values", 0) * 1000).toLocaleDateString("en-US"));
    $("#date-amount-end").val(new Date($("#slider-range2").slider("values", 1) * 1000).toLocaleDateString("en-US"));
  } else if (this.value === "2020") {
    $("#slider-range2").slider({
      range: true,
      min: new Date('2019.07.01').getTime() / 1000,
      max: new Date('2020.02.21').getTime() / 1000,
      values: [new Date('2019.07.01').getTime() / 1000, new Date('2020.02.21').getTime() / 1000],
      disabled: false,
      slide: function slide(event, ui) {
        $("#date-amount-start").val(new Date(ui.values[0] * 1000).toLocaleDateString("en-US"));
        $("#date-amount-end").val(new Date(ui.values[1] * 1000).toLocaleDateString("en-US"));
      }
    });
    $("#date-amount-start").val(new Date($("#slider-range2").slider("values", 0) * 1000).toLocaleDateString("en-US"));
    $("#date-amount-end").val(new Date($("#slider-range2").slider("values", 1) * 1000).toLocaleDateString("en-US"));
  }
}); // Add label to popularity display

$('input[type=radio]').on('change', function () {
  if (this.value !== "2016" && this.value !== "2020") {
    $('#dimension-type').text(this.value);
  }
}); // Make sidebar resizable

/*$("#sidenav").resizable({
    handles: 'e'
});*/
},{}]},{},["d0Si"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-where-my-country-gone/sliders.b33eadbc.js.map