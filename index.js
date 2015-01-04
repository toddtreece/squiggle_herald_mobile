var http = require('http'),
    fs = require('fs'),
    port = process.env.SQUIGGLE_HERALD_MOBILE_PORT || 3000,
    host = process.env.SQUIGGLE_HERALD_MOBILE_HOST || '127.0.0.1';

// grab the template html
var header = fs.readFileSync('./header.html'),
    footer = fs.readFileSync('./footer.html');

http.createServer(function(req, res) {

  var url = 'http://squiggle.city' + req.url;

  // set content type
  res.setHeader('Content-Type', 'text/html');

  // send the header template to the client
  res.write(header);

  // if url doesn't end in txt, return
  if(! /txt$/.test(url)) {
    return res.end(footer);
  }

  // load the requested txt file
  http.get(url, function(txt) {

    // end response if txt file can't be loaded
    if(txt.statusCode != 200) {
      return res.end(footer);
    }

    // we can't use txt.pipe(res); here
    // because we need to output the footer
    // after the txt file has finished
    txt.on('data', function(chunk) {
      res.write(chunk);
    });

    // send the footer, and end the response
    txt.on('end', function() {
      res.end(footer);
    });

  }).on('error', function(e) {

    // end response if there is an error
    res.end(footer);

  });


}).listen(port, host);

console.log('Mobile running at http://%s:%d/', host, port);

