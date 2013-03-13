var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
//we are bringing the response object from the server TO the request handlers,
//not returning content from the request handlers back to the server to respond.
//instead, having the response object here allows the request handlers to 
//operate aysnchronously (as node requires) whilst providing content back to the
//browser once the callbacks are called and proper content available.
//if we were to return content back to the server, and let it respond appropriately,
//with its own response object, we run the risk of returning no content because the async
//operation may not have finished (and thus populating the content to return).

function start(request, response) {
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
      '<form action="/upload" enctype="multipart/form-data" ' +
      'method="POST">' +
      '<input type="file" name="upload">' +
      '<input type="submit" value="Upload file"/>' +
      '</form>' +
      '</body>' +
      '</html>';

      response.writeHead(200, {"Content-Type":"text/html"});
      response.write(body);
      response.end();
}

function upload(request, response) {
  console.log("*** Request handler 'upload' was called. ***");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
  console.log("parseing done.");

  /* possible error on Windows systems: 
     tried to rename to an already existing file.*/
  fs.rename(files.upload.path, "/tmp/test.png", function(error) {
    if (error) {
      fs.unlink("/tmp/test.png");
      fs.rename(files.upload.path, "/tmp/test.png");
    }
  });
  response.writeHead(200, {"Content-Type":"text/html"});
  response.write("received image:<br/> ");
  response.write("<img src='/show' />"); 
  response.end();
  });
}

function show(request, response) {
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
