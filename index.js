var path = require('path');
var express = require('express');
var config = require('./config/default');
var routes = require('./routes');
var app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

routes(app);

app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  });
});


app.set('port', config.port);


if (module.parent) {
  module.exports = app;
} else {
  app.listen(config.port, function () {
    console.log(`listening on port ${config.port}`);
  });
}

