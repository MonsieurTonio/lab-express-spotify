const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static('public'))

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'a8048fb989ca40329a4cc5390121097b',
    clientSecret = '050f512eab46425ca0351050890abf88';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


var artist = {name: ' '}

app.get('/', function (req, res) {
    res.render('index')
})


app.get('/artists', function (req, res) {
    spotifyApi.searchArtists(req.query.artist)
    .then(data => {
        // res.send(data)
        console.log(data.body.artists.items)
        res.render('artists', {artists: data.body.artists.items })
    })
    .catch(err => {
        console.log(error)
    })
})



app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
  .then(
    function(data) {
        // res.send(data.body)
    console.log(data.body.items)
      res.render('albums', {albums: data.body.items })
    },
    function(err) {
      console.error(err);
      res.send(err)
    }
  );
});


app.listen(3000, () => console.log('Spotify app listening on port 3000!'))


