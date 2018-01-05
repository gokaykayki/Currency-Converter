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
  var exist = false;
  buttonC.innerHTML = chrome.i18n.getMessage("buttonText"); //set button text

  if(site == "www.bittrex.com" || site == "bittrex.com"){
    balanceCol = $("#balance-wrapper #pad-wrapper .row:first .col-lg-12 .row:nth-child(2)"); //the place where the button will be added
    estimatedDiv = balanceCol.find("h4"); //the tag that contains the balance
    buttonC.className = "cbBittrex convertButton"; //add class to button for css
  }else if(site == "www.binance.com"|| site == "binance.com"){
    balanceCol = $("li.total"); //the place where the button will be added
    estimatedDiv = balanceCol.find("strong.ng-scope"); //the tag that contains the balance
    buttonC.className = "cbBinance convertButton"; //add class to button for css
  }else if(site == "www.poloniex.com"|| site == "poloniex.com"){
    balanceCol = $("div.supressWrap:first"); //the place where the button will be added
    estimatedDiv = balanceCol.find("span#accountValue_usd"); //the tag that contains the balance
    buttonC.className = "cbPoloniex convertButton"; //add class to button for css
  }else if(site == "www.bitstamp.net"|| site == "bitstamp.net"){
    balanceCol = $("div.total-account-value .row_33:nth-child(4) ul"); //the place where the button will be added
    estimatedDiv = balanceCol.find("li:first"); //the tag that contains the balance
    buttonC.className = "cbBitstamp convertButton"; //add class to button for css
  }

  balanceCol.append(buttonC);

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
    if(exist == false){
      estimatedDiv.append(appendString); // add converted amount and currency
      exist = true;
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
      if(exist == false){
        estimatedDiv.append(appendString);
        exist = true;
      }
    } else{
      estimatedDiv.append(" / Currency error"); // add error
    }
  }

  function poloniex() {
    estimated = balanceCol.html(); // get total balance;
    from = balanceCol.find(".supressWrap:first").html().charAt(0);
    amount = estimatedDiv.html() // balance amount
    if( from == "$"){
      from = "USD";
      convert();
      if( amount == "0.00"){
        appendString = " / 0 " + to;
      }else{
        appendString = " / " + parseAmount;
      }
      if(exist == false){
        balanceCol.find(".supressWrap:first").append(appendString); // add converted amount and currency
        exist = true;
      }
    }else{
      balanceCol.find(".supressWrap:first").append("Currency error");
    }
  }

  function bitstamp() {
    estimated = estimatedDiv.find('strong.account-balance-section-value'); // get total balance;
    from = "USD";
    amount = estimated.html() // balance amount
    if( amount == "0.00"){
      parseAmount = "0.00"
    }else{
      convert();
    }
    appendString = "						" + to + " <strong class='account-balance-section-value convertedAmount'></strong>";
    if(exist == false){
      balanceCol.find(".convertButton").before('<li>'+appendString+'</li>'); // add converted amount and currency
      balanceCol.find('.convertedAmount').html(parseAmount);
      exist = true;
    }
  }


  $(balanceCol).on('click', ".convertButton", function(){
    if(site == "www.bittrex.com" || site == "bittrex.com"){
      bittrex();
    }else if(site == "www.binance.com" || site == "binance.com"){
      binance();
    }else if(site == "www.poloniex.com" || site == "poloniex.com"){
      poloniex();
    }else if(site == "www.bitstamp.net" || site == "bitstamp.net"){
      bitstamp();
    }
  });

});
