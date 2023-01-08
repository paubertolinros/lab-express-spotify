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

/* GET contact page. 
app.get('/contact', function (req, res, next) {
  res.render('contact');
});*/

/* GET artist search page. */
app.get('/artist-search', function (req, res, next) {
  const { artist } = req.query;
  //const artist = req.query.artist; FUNCIONA, no entec diferències
  // entre 1ª i 2ª opció
  //const artistQuery = req.query.name; EM SURT UNDEFINED
  console.log('This is artist Query1:', artist)
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items);
      console.log('artistData:', data.body.artists.items)
      const artistData = data.body.artists.items;
      res.render('artist-search-results', { artist ,artistData } ) 
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
      res.render('albums', { artistId, albumData})
    }, function(err) {
     console.error(err);
  });
}); 

/* GET tracks page. */
app.get('/albums/:artistId/tracks/:albumId', (req, res, next) => {
  const { artistId, albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      console.log('The recived:', data.body.items);
      const tracksData = data.body.items
      res.render('tracks', {artistId, albumId, tracksData})
    }, function (err) {
      console.log('Something went wrong!', err);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
