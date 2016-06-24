const express = require('express');
const http = require('http');
const app = express();

const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('./'));

app.set('view engine', 'ejs');
app.set('views', './');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api/search', urlencodedParser, (req, res) => {
  if (req.body.searchObjectWithGeo) {
    console.log(req.body.searchObjectWithGeo);
    // TO DO (with geolocation)
    res.send('ok');
    return;
  }
  // TO DO (without geolocation)
});

http.createServer(app).listen(7788);
