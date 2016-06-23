const express = require('express');
const http = require('http');
const app = express();

const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('./'));

app.set('view engine', 'ejs');
app.set('views', './');

app.get('/', (req, res, next) => {
  res.render('index');
});

app.post('/api/search', urlencodedParser, (req, res) => {
  console.log(req.body.searchObject);
  res.send('ok');
});

http.createServer(app).listen(7788);
