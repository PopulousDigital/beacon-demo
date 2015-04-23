var user = {
  token : null,
  set : function(response) {
    if (response == null) {
      ajax(API_URL + '?Key=' + API_KEY + '&Method=SetToken', 'user.set');
    } else {
      if (response.result === 'success') {
        alert('Go your token!');
      } else {
        var errors = '';
        $.each(response.errors, function(key, value) {
          errors += value + '\n';
        });
        alert(errors);
      }
    }
  }
};
