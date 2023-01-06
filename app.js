require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index');
});

/* GET artist search page. */
app.get('/artist-search', function (req, res, next) {
  const query = req.query.artist
  spotifyApi
    .searchArtists(query)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items);
      const artistData = data.body.artists.items;
      console.log(`artistData: ${ artistData }`)
      res.render('artist-search-results', { artistData } ) 
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
});

/* GET albums page. */
app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      const albumData = data.body.items;
      console.log(albumData)
      res.render('albums', { albumData})
    }, function(err) {
     console.error(err);
  });
}); 

/* GET tracks page. */
app.get('/albums/:artistId/tracks', (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getAlbumTracks(artistId)
    .then(data => {
      console.log('The recived:', data.body.items);
      const tracksData = data.body.items
      res.render('tracks', { tracksData })
    }, function (err) {
      console.log('Something went wrong!', err);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
