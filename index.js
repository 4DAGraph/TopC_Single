var path = require('path');
var express = require('express');
var config = require('./config/default');
var routes = require('./routes');
var app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
routes(app);

/*
app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  });
});
*/

app.set('port', config.port);
var cluster = require('cluster');
var http = require('http');
var numCPUs = process.argv[2] || require('os').cpus().length;
//numCPUs = 1;
if (cluster.isMaster) {
        for (var i = 0; i < numCPUs; i++) {
                cluster.fork();
        }

        cluster.on('listening', (worker, address) => {
                //console.log('worker ' + worker.process.pid +', listen: '+address.address+":"+address.port);
        });
        cluster.on('exit', (worker, code, signal) => {
                //console.log('worker ' + worker.process.pid + ' died');
                cluster.fork();
        });
} else {
        app.listen(app.get('port'));
}

app.use(function (err, req, res, next) {
	//console.error(err.stack)
	res.status(500).send({"error":"error parameter","status":"1","message":err.stack})
})

//app.set('port', config.port);

/*
if (module.parent) {
  module.exports = app;
} else {
  app.listen(config.port, function () {
    console.log(`listening on port ${config.port}`);
  });
}
*/
