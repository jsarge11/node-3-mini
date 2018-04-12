const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const createInitialSession = require('./middleware/session')
const session = require('express-session')
const filter = require('./middleware/filter')
require('dotenv').config()

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `../build` ) );

app.use(session({ 
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true,
 cookie: {
  maxAge: 10000
 }
}))

// how is this capturing req, res, and next
app.use ( ( req, res, next )  => createInitialSession( req, res, next) );
app.use ( ( req, res, next ) => {
 if (req.method === "PUT" || req.method === "POST") {
  filter(req, res, next)
 }
 else {
  next();
 }
})


app.get("/api/messages/history", mc.history);
app.post( "/api/messages", mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", mc.update );
app.delete( "/api/messages", mc.delete );

const port = process.env.PORT || 4000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );