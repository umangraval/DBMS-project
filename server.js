const express = require('express')
const app =express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs');
const db = require('./queries')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true})); 

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })
app.get('/property', db.getproperty)
app.get('/property/:place', db.getpropertyByplace)
app.post('/sell', db.sell)
app.get('/:proid/reviews', db.getreviews);
app.post('/signin', db.handleSignin);
app.post('/register',db.handleRegister);
app.post('/:proid/rent',db.getrented);


app.listen(3000,function(){
    console.log("server on port 3000");
});