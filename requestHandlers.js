var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");

//we are bringing the response object from the server TO the request handlers,
//not returning content from the request handlers back to the server to respond.
//instead, having the response object here allows the request handlers to 
//operate aysnchronously (as node requires) whilst providing content back to the
//browser once the callbacks are called and proper content available.
//if we were to return content back to the server, and let it respond appropriately,
//with its own response object, we run the risk of returning no content because the async
//operation may not have finished (and thus populating the content to return).

function start(response, postData) {
  console.log("*** Request handler 'start' was called. ***");

  /*
  //exec("ls -lah", function (error, stdout, stderr) {
  //"find /" is a really expensive action, taking time to complete.
  //using this operation illustrates the async nature of node
  //and it being to still be able to handle subsequent requests whilst
  //"find /" is working in the background.
    exec("find /", 
      {timeout: 10000, maxBuffer: 20000*1024},
      function (error, stdout, stderr) {
        response.writeHead(200, {"Content-Type":"text/plain"});
        response.write(stdout);
        response.end();
      });
   */


    var body = '<html>' +
      '<head>' +
      '<meta http-equiv="Content-Type" content="text/html" ' +
      'charset=UTF-8" /> ' +
      '</head>' +
      '<body>' +
      '<form action="/upload" method="POST">' +
      '<textarea name="textie" rows="20" cols="60"></textarea>' +
      '<input type="submit" value="Submit text"/>' +
      '</form>' +
      '</body>' +
      '</html>';

      response.writeHead(200, {"Content-Type":"text/html"});
      response.write(body);
      response.end();
}

function upload(response, postData) {
  console.log("*** Request handler 'upload' was called. ***");
  response.writeHead(200, {"Content-Type":"text/plain"});
  //response.write("POST DATA RECEIVED: " + postData);
  response.write("You've sent the text: " + 
  querystring.parse(postData).textie);
  response.end();
}

function show(response, postData) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if (error) {
      response.writeHead(500, {"Content-Type":"text/plain"});
      response.write(error + "\n");
      response.end(); 
   } else {
     response.writeHead(200, {"Content-Type":"image/png"});
     response.write(file, "binary");
     response.end();
   }
});
}

exports.start = start;
exports.upload = upload;
exports.show = show; 
