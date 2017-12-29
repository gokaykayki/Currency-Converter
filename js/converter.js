$(document).ready(function(){
  "use strict"

  //Variable definitions
  var to = "" // target currency
  var buttonC = document.createElement("button"); //converter button
  var balanceCol = $("#balance-wrapper #pad-wrapper .row:first .col-lg-12 .row:nth-child(2)"); //the place where the button will be added
  var estimatedDiv = balanceCol.find("h4"); //the tag that contains the balance

  buttonC.innerHTML = chrome.i18n.getMessage("buttonText"); //set button text
  buttonC.className = "converterButton"; //add class to button for css

  balanceCol.append(buttonC); //place the button

  // get target currency from local storage
  chrome.storage.sync.get(['to'], function(items) {
    to = items.to;
  });

  $(balanceCol).on('click', ".converterButton", function(){
    var estimated = balanceCol.find("h4").html(); // get total balance
    var fSplit = estimated.split(" ");
    var from = fSplit[6]; // displayed currency (this can be removed soon)
    var amount = fSplit[5]; // balance amount
    var result = '';
    var url = "https://finance.google.com/finance/converter?a=" + amount + "&from=" + from + "&to=" + to;
    $.ajaxSetup({async: false});
    $.get(url, function (data) {
      // parse the page
      var startPos = data.search('<div id=currency_converter_result>');
      var endPos = data.search('<input type=submit value="Convert">');
      if (startPos > 0) {
        result = data.substring(startPos, endPos);
        result = result.replace('<div id=currency_converter_result>', '');
        result = result.replace('<span class=bld>', '');
        result = result.replace('</span>', '');
        var rSplit = result.split(" = "); // we got the converted amount and currency on rSplit[1]
        if(fSplit.length < 8){
          estimatedDiv.append(" / " + rSplit[1]); // add converted amount and currency
        }
      }
    });
  });

});
