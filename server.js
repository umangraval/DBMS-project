const express = require('express')
const app =express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs');
const db = require('./queries')

app.set("view engine","ejs");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true})); 

app.get('/', (request, response) => {
    response.json({ info: 'welcome' })
  })
app.get('/property',db.getproperty);
app.get('/property/:id', db.getpropertyById)
app.get('/sell', db.sell)
app.get('/:proid/reviews', db.getreviews);
app.post('/signin', db.handleSignin);
app.post('/register',db.handleRegister);
// app.post('/property/:proid/rent',db.getrented);
 app.post("/property", db.update);


app.listen(3000,function(){
    console.log("server on port 3000");
});