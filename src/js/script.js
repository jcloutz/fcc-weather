"use strict";

$(document).ready(function() {
  var $toggles = $('.weather-toggle');
  var $html = $('html');
  var $imageChecker = $('.image-checker');

  $toggles.click(function() {
    var val = $(this).val();
    $html.attr('class', '');

    // if (val !== 'none') {
    //   $html.addClass(val + ' loaded');
    // } else {
    //   $html.addClass('unloaded');
    // }
    // create element and give it the background selector
    $imageChecker.attr('class', 'image-checker ' + val).waitForImages(function() {
      if (val !== 'none') {
        $html.addClass(val + ' loaded');
      } else {
        $html.addClass('unloaded');
      }
    }, $.noop, true);

  });
});
