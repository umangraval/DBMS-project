const bcrypt = require('bcrypt-nodejs');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'umang13',
  host: 'localhost',
  database: 'real-estate',
  password: '',
  port: 5432,
})
const getproperty = (request, response) => {
    pool.query('SELECT * FROM property ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const getpropertyByplace = (request, response) => {
    const place = request.params.place
    pool.query('SELECT * FROM property WHERE place = $1', [place], (error, results) => {
      if (error) {
        response.status(400).json('wrong credentials')
      }
      response.status(200).json(results.rows)
    })
  }
  const getreviews = (request, response) => {
      const proid = request.params.proid
    pool.query('SELECT * FROM reviews where proid = $1',[proid], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const sell = (request, response) => {
    const { place } = request.body;
    console.log(place);
    pool.query('INSERT INTO property (place) VALUES ($1)', [place], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`place added`)
    })
  }

  const handleRegister = (request, response)=>{
    const { email,username,password} =request.body;
    pool.query('INSERT INTO users (email, username, password) VALUES ($1,$2,$3)', [email,username,password], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`user added`)
    })
  }

  const handleSignin = (request,response) => {
    const { password, email}  = request.body;
    pool.query('SELECT email,password FROM users WHERE password =$1 AND email=$2',[password,email],(error,results)=>{
        console.log(results);
        if(error){
            throw error;
        }
        else{ 
            if(results.rowCount === 0){
                response.status(404).send('not found');
            }
            else if(results.rows[0].password === password && results.rows[0].email === email){
            pool.query('INSERT INTO login (email,password) VALUES ($1,$2)',[email,password]);
            response.status(404).send('logged in');
            }
        }
    })
}

const getrented = (request, response) =>{
    const 
}
  module.exports = {
    getproperty,
    getpropertyByplace,
    sell,
    getreviews,
    handleRegister,
    handleSignin
  }