$(document).ready(function(){
  "use strict"
  function replace_i18n(obj, tag) {
    var msg = tag.replace(/__MSG_(\w+)__/g, function(match, v1) {
        return v1 ? chrome.i18n.getMessage(v1) : '';
    });

    if(msg != tag) obj.innerHTML = msg;
  }
  function localizeHtmlPage() {
    var data = document.querySelectorAll('[data-localize]');

    for (var i in data) if (data.hasOwnProperty(i)) {
        var tag = data[i].getAttribute('data-localize').toString();

        replace_i18n(data[i], tag);
    }

    var page = document.getElementsByTagName('html');

    for (var j = 0; j < page.length; j++) {
        var obj = page[j];
        var tag = page[j].innerHTML.toString();

        replace_i18n(page[j], tag);
    }
  }

  localizeHtmlPage(); // set strings

  $("main").on("click", "button.saveButton", function(){
    var from = $("select[name='from'] option:selected").val();  // get values of selected currencies
    var to = $("select[name='to'] option:selected").val();

    chrome.storage.sync.set({'from': from, 'to': to}, function() { // set new currencies to local storage
      $('.saveStatus').text(chrome.i18n.getMessage("popupSaveSuc")); // show success message
    });
  });

  chrome.storage.sync.get(['to'], function(items) {  // get target currency
    $("select[name='to'] option").each(function(){
      if($(this).val() == items.to){
        $(this).attr('selected', true); // selected currency option is selected now
      }
    });
  });

});
