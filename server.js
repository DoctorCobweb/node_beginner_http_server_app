var http = require('http');
var url = require('url');

function start(route, handle) {
  function onRequest(request, response){
      var postData = "";
      var pathname = url.parse(request.url).pathname;
      console.log("Request for " + pathname + " received.");

      request.setEncoding("utf-8");
    
      //to listen to events use 'request.on' or 'request.addListener'
      //request.addListener("data", function(postDataChunk){
      request.on("data", function(postDataChunk){
        postData += postDataChunk;
        console.log("Received POST data chunk '" + postDataChunk + "'.");
      });

      //request.addListener("end", function(){
      request.on("end", function(){
        route(handle, pathname, response, postData);

      });

      //route(handle, pathname, response);

      //response.writeHead(200, {'Content-Type': 'text/plain'});
      //response.write('Hello World!');
      //response.end();
    }
  
  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;


