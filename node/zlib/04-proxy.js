#!/usr/bin/node

var http = require('http'),
    url = require('url'),
    zlib = require('zlib');

http.createServer(function(req, res) {
  greenMsg('[REQUEST HEADER]');
  console.log(req.headers);

  var options = url.parse(req.url);
  options.headers = req.headers;

  var proxyRequest = http.request(options, function(proxyResponse) {
    proxyResponse.on('data', function(chunk) {
      greenMsg('[RESPONSE BODY]');
      console.log(zlib.gunzipSync(chunk).toString('utf8'));
      res.write(chunk, 'binary'); 
    });
    proxyResponse.on('end', function() {res.end();});

    greenMsg('[RESPONSE HEADER]');
    console.log(proxyResponse.statusCode, proxyResponse.headers);
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
  });

  req.on('data', function(chunk) {
    proxyRequest.write(chunk, 'binary');
  });

  req.on('end', function() {
    proxyRequest.end();
  });
}).listen(8080);

function greenMsg(msg) {  console.log('\n\033[1;32m' + msg + '\033[1;37m');  }
