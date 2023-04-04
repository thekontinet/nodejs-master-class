/* Importing the modules from the node_modules folder. */
require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')

/* Importing the routes from the routes folder. */
const userRoute = require('./routes/user-route')
const noteRoute = require('./routes/note-route')
const tokenRoute = require('./routes/token-route')

/* Creating an instance of the express module. */
const app = express()

/* Creating a server. */
const server = http.createServer(app)


/* A middleware that parses the body of the request and makes it available in the req.body property. */
app.use(cors())
app.use(express.json())

// Registering the routes to our express application
app.use(userRoute)
app.use(noteRoute)
app.use(tokenRoute)



mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Database connected');
    /* Listening to the port 3000 and logging the message to the console. */
    const PORT = process.env.PORT
    server.listen(PORT, function(){
        console.log(`Server started at http://localhost:${PORT}`);
    })
})
.catch(err => console.log(err.message))

