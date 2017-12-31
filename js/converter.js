$(document).ready(function(){
  "use strict"

  //Variable definitions
  var to = "" // target currency
  var buttonC = document.createElement("button"); //converter button
  var site = $(location).attr('hostname');
  var balanceCol = "";
  var estimatedDiv = "";
  var estimated = "";
  var fSplit = "";
  var from = "";
  var to = "";
  var result = "";
  var amount = "";
  var localAmount = "";
  var rSplit = "";
  var parseAmount = "";
  var appendString = "";
  var url = "https://finance.google.com/finance/converter?a="; // pre
  buttonC.innerHTML = chrome.i18n.getMessage("buttonText"); //set button text

  if(site == "www.bittrex.com" || site == "bittrex.com"){
    balanceCol = $("#balance-wrapper #pad-wrapper .row:first .col-lg-12 .row:nth-child(2)"); //the place where the button will be added
    estimatedDiv = balanceCol.find("h4"); //the tag that contains the balance
    buttonC.className = "cbBittrex convertButton"; //add class to button for css
  }else if(site == "www.binance.com"|| site == "binance.com"){
    balanceCol = $("li.total"); //the place where the button will be added
    estimatedDiv = balanceCol.find("strong.ng-scope"); //the tag that contains the balance
    buttonC.className = "cbBinance convertButton"; //add class to button for css
  }

  balanceCol.append(buttonC); //place the button

  // get target currency from local storage
  chrome.storage.sync.get(['to'], function(items) {
    if(!items.to){
      to = "USD";
    }else{
      to = items.to;
    }
  });

  function convert(){
    url = url + amount + "&from=" + from + "&to=" + to;
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
        rSplit = result.split(" = "); // we got the converted amount and currency on rSplit[1]
        parseAmount = rSplit[1];
      }
    });
  }

  function bittrex(){
    estimated = balanceCol.find("h4").html(); // get total balance
    fSplit = estimated.split(" ");
    from = fSplit[6]; // displayed currency (this can be removed soon)
    amount = fSplit[5]; // balance amount
    convert();
    if( amount == "0.00"){
      appendString = " / 0 " + to;
    }else{
      appendString = " / " + parseAmount;
    }
    if(fSplit.length < 8){
      estimatedDiv.append(appendString); // add converted amount and currency
    }
  }

  function binance(){
    estimated = estimatedDiv.text(); // get total balance
    from = estimated.charAt(0); // displayed currency (this can be removed soon)
    if( from == "$"){
      from = "USD";
      amount = estimated.slice(1,estimated.length); // balance amount
      convert();
      if( amount == "0.00"){
        appendString = " / 0 " + to;
      }else{
        appendString = " / " + parseAmount;
      }
      if(estimated.indexOf("/") == -1){
        estimatedDiv.append(appendString);
      }
    } else{
      estimatedDiv.append(" / Currency error"); // add error
    }
  }

  $(balanceCol).on('click', ".convertButton", function(){
    if(site == "www.bittrex.com" || site == "bittrex.com"){
      bittrex();
    }else if(site == "www.binance.com" || site == "binance.com"){
      binance();
    }
  });

});
