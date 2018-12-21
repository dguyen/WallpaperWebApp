(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const refresh_token = urlParams.get('refresh_token');
  if (refresh_token) {
    tokenFound(refresh_token);
  } else {
    document.getElementById('setupCard').style.width = 'fit-content';
  }
})();

function tokenFound(refresh_token) {
  document.getElementById('tokenReceived').style.display = 'block';
  setCookie('refreshToken', refresh_token, 0.5);
}

function setCookie(cname, cvalue, hours) {
  var d = new Date();
  d.setTime(d.getTime() + (hours*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
