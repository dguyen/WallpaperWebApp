const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request');

// Spotify API settings
const client_id = 'd230707936dc4662ac81eddf2fbae9e0';
const client_secret = '74c70892279f457b8a41d08eeabb9c6d'; // Reset client_secret after making repository public
const redirect_uri = 'http://localhost:3000/api/callback';
const stateKey = 'spotify_auth_state';

// Error handling
const sendError = (err, res) => {
  res.status(501).json({
    status: 501,
    message: typeof err == 'object' ? err.message : err
  });
};

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get('/login', function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-library-read user-read-playback-state user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  );
});

// Requests refresh and access tokens after checking the state parameter
router.get('/callback', function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var refresh_token = body.refresh_token;
        res.redirect('/setup?' +
          querystring.stringify({
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/setup?' +
          querystring.stringify({
            error: 'invalid_token'
          })
        );
      }
    });
  }
});

// Requesting access token from refresh token
router.get('/refresh_token', function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (error) {
      next(error);
    } else if(body.error) {
      sendError(body, res);
    } else {
      res.send({
        'access_token': body.access_token,
        'expires_in': body.expires_in
      });
    }
  });
});

router.get('/load_token', function (req, res) {
  let refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    res.send({
      refresh_token: refreshToken
    });
  } else {
    sendError('No token found', res);
  }
});

module.exports = router;
