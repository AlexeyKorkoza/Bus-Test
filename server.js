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

app.post('/url', urlencodedParser, function (req, res) {
  console.log(req.body);
});

http.createServer(app).listen(7788);
