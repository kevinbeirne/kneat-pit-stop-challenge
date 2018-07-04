
var http = require('http');

var express = require('express'),
  app = express(),
  httpServer = http.Server(app);

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.listen(3000);
console.log("Listening on port 3000");
