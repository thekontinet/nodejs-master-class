/* Importing the modules from the node_modules folder. */
const express = require('express')
const http = require('http')

/* Importing the routes from the routes folder. */
const userRoute = require('./routes/user-route')
const noteRoute = require('./routes/note-route')
const tokenRoute = require('./routes/token-route')

/* Creating an instance of the express module. */
const app = express()

/* Creating a server. */
const server = http.createServer(app)


/* A middleware that parses the body of the request and makes it available in the req.body property. */
app.use(express.json())

// Registering the routes to our express application
app.use(userRoute)
app.use(noteRoute)
app.use(tokenRoute)


/* Listening to the port 3000 and logging the message to the console. */
server.listen(3000, function(){
    console.log('Server started at http://localhost:3000');
})
