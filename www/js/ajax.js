var ajax = function(url, callback) {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'jsonp',
    jsonpCallback: callback,
    jsonp: 'callback'
  });
}
