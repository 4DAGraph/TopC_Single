var bodyParser = require('body-parser');

module.exports = function (app) {

	console.log("router initial");
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.get('/', function (req, res) {
  });

  app.use('/topChain', require('./topChain'));

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('404');
    }
  });
	console.log("router end");
};
