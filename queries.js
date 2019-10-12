const bcrypt = require('bcrypt-nodejs');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'umang13',
  host: 'localhost',
  database: 'real-estate',
  password: '',
  port: 5432,
})
var customerid;
var propertyid;

const getproperty = (request, response) => {
    pool.query('SELECT * FROM property ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).render("properties",{results: results});
    })
  }
  
  const getpropertyById = (request, response) => {
    const id = request.params.id;
    propertyid=id;
    pool.query('SELECT * FROM property WHERE id = $1', [id], (error, foundinfo) => {
        pool.query('SELECT comment FROM reviews WHERE proid=$1',[id],(err,reviews)=>{
        if (error) {
        response.redirect("/property");
            }
        response.status(200).render("showproperty",{foundinfo:foundinfo,reviews:reviews});
        })
    })
  }
  const addreviews = (request, response) => {
      const comment = request.body.comment;
     const proid= propertyid;
     console.log(comment);
      pool.query('INSERT INTO reviews (comment,proid) VALUES ($1,$2)',[comment,proid], (error, comments) => {
      response.redirect("/property/"+proid);
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
     pool.query('SELECT userid,email,password FROM users WHERE email=$1 AND password=$2',[email,password],(err,result)=>{
     if(result.rowCount>0){
        if(result.rows[0].email===email && result.rows[0].password===password){
            customerid=result.rows[0].userid;
            pool.query('INSERT INTO login (email,password) VALUES ($1,$2)', [email,password], (error, login) => {
                if (error){
                  res.render("siginin");
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
        if (err){
            res.render("register");
        }else{
            pool.query('SELECT userid FROM users',(err,uid)=>{
                customerid=uid.rows[0].userid;
            })
            res.redirect("/property");
        }
        })
    }

    const rent = (req,res)=> {
        res.render("rent",{id:propertyid});
    }

    const rentdetails = (req,res)=>{
        const person=req.body.person;
        const duration=req.body.duration;
        proid = propertyid;
        id=customerid;
        pool.query('INSERT INTO renter (cusid,person,duration,propertyid) VALUES ($1,$2,$3,$4)',[id,person,duration,proid],(err,data)=>{
                res.redirect('/property');
        })    
    }
  

    const showtrasaction = (req,res)=> {
        pool.query('SELECT * FROM transaction WHERE userid=$1',[customerid],(err,data)=>{
            res.render("showtransactions",{id:propertyid,uid:customerid,data:data});
        })
    }

    module.exports = {
    getproperty,
    getpropertyById,
    sell,
    addreviews,
    handleregister,
    register,
    update,
    handlesignin,
    signin,
    rentdetails,
    rent,
    showtrasaction
  }