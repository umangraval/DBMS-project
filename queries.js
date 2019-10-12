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
      response.status(200).render("properties",{results: results});
    })
  }
  const getpropertyById = (request, response) => {
    const id = request.params.id
    pool.query('SELECT * FROM property WHERE id = $1', [id], (error, foundinfo) => {
      if (error) {
        response.status(400).json('wrong credentials')
        response.redirect("/property");
      }
      response.status(200).render("showproperty",{foundinfo:foundinfo});
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
    // const { place } = request.body;
    // //console.log(place);
    // pool.query('INSERT INTO property (place) VALUES ($1)', [place], (error, results) => {
    //   if (error) {
    //     throw error
    //   }
      response.status(201).render("newproperty");
    //})
  }

//   const handleRegister = (request, response)=>{
//     const { email,username,password} =request.body;
//     pool.query('INSERT INTO users (email, username, password) VALUES ($1,$2,$3)', [email,username,password], (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(201).send(`user added`)
//     })
//   }

//   const handleSignin = (request,response) => {
//     const { password, email}  = request.body;
//     pool.query('SELECT email,password FROM users WHERE password =$1 AND email=$2',[password,email],(error,results)=>{
//         if(error){
//             throw error;
//         }
//         else{ 
//             if(results.rowCount === 0){
//                 response.status(404).send('not found');
//             }
//             else if(results.rows[0].password === password && results.rows[0].email === email){
//             pool.query('INSERT INTO login (email,password) VALUES ($1,$2)',[email,password]);
//             response.status(404).json({
//                 email: email,
//                 username: results.rows[0].username
//             });
//             }
//         }
//     })
// }
const update=(req,res)=>{
     const place = req.body.place;
     const name = req.body.name;
     const cost = parseInt(req.body.cost);
     
     pool.query('INSERT INTO property (place,cost,name) VALUES ($1,$2,$3)', [place,cost,name], (error, results) => {
      if (error) {
        res.render("newproperty");
      }else{
          res.redirect("/property");
      }
    }) 
}

const signin = (req,res) => {
    res.render("signin");
}

const handlesignin = (req,res) => {
     const email = req.body.email;
     const password = req.body.password;
     pool.query('SELECT email,password FROM users WHERE email=$1 AND password=$2',[email,password],(err,result)=>{
     if(result.rowCount>0){
        if(result.rows[0].email===email && result.rows[0].password===password){
            pool.query('INSERT INTO login (email,password) VALUES ($1,$2)', [email,password], (error, login) => {
                if (error){
                  res.render("/siginin");
                }else{
                    res.redirect("/property");
                }
            })
        }
        else{
            res.redirect("/siginin");
        }
    }
});
}


const register = (req,res) => {
    res.render("register");
}

const handleregister = (req,res) => {
     const username = req.body.username;
     const email = req.body.email;
     const password = req.body.password;
     pool.query('INSERT INTO users (username,email,password) VALUES ($1,$2,$3)',[username,email,password],(err,result)=>{
        if (error){
            res.redirect("/register");
        }else{
            res.redirect("/property");
        }
        })
    }
  
    module.exports = {
    getproperty,
    getpropertyById,
    sell,
    getreviews,
    handleregister,
    register,
    update,
    handlesignin,
    signin
  }