const http = require('http')

// Creating a simple server that respond with hello world
const server = http.createServer(function(req, res){
    res.end('Hello')
})

// Set server to listen to a port
server.listen(3000, function(){
    console.log(`Server runing at http://127.0.0.1:3000`);
})