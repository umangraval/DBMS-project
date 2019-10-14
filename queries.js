const bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var hash = require('object-hash');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'umang13',
  host: 'localhost',
  database: 'real-estate',
  password: '',
  port: 5432,
})
var name;
var customerid;
var propertyid;
var propertycost;
var c=0;
var token;

const getproperty = (request, response) => {
    pool.query('SELECT * FROM property ORDER BY id ASC', (error, results) => {
      console.log(name);
        if (error) {
        throw error
      }
      response.status(200).render("properties",{results: results,name:name});
    })
  }
  
  const getpropertyById = (request, response) => {
    const id = request.params.id;
    propertyid=id;
    pool.query('SELECT * FROM property WHERE id = $1', [id], (error, foundinfo) => {
        propertycost=foundinfo.rows[0].cost;
        //console.log(foundinfo);
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
     const image = req.body.pic;
     //console.log(image);
     pool.query('INSERT INTO property (place,cost,name,imageurl,ownerid) VALUES ($1,$2,$3,$4,$5)', [place,cost,name,image,customerid], (error, results) => {
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
     pool.query('SELECT username,userid,email,password FROM users WHERE email=$1 AND password=$2',[email,password],(err,result)=>{
        if(result.rowCount>0){
        if(result.rows[0].email===email && result.rows[0].password===password){
            customerid=result.rows[0].userid;
            name = result.rows[0].username;
            pool.query('INSERT INTO login (email,password) VALUES ($1,$2)', [email,password], (error, login) => {
                if (error){
                  res.render("siginin");
                }else{
                    res.redirect("/property");
                    }
            })
        }
        else{
            res.redirect("/signin");
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
            pool.query('SELECT userid,username FROM users WHERE email=$1',[email],(err,uid)=>{
                customerid=uid.rows[0].userid;
                name=uid.rows[0].username;
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
        var total;
        proid = propertyid;
        id=customerid;
        pool.query('SELECT cost FROM property WHERE id=$1',[proid],(err,costs)=>{
        const total =Number((costs.rows[0].cost) * duration);
        console.log(total);            
        pool.query('INSERT INTO renter (cusid,person,duration,propertyid,total_rent) VALUES ($1,$2,$3,$4,$5)',[id,person,duration,proid,total],(err,data)=>{
            console.log(err);    
            res.redirect('/showrent');
        })    
    });
}
    const showrent = (req,res) => {
        pool.query('SELECT * FROM renter WHERE cusid = $1',[customerid],(err,data)=>{
            res.render("rentpay",{data:data});
        })
    }

    const showtrasaction = (req,res)=> {
        pool.query('SELECT * FROM transaction WHERE userid=$1',[customerid],(err,data)=>{
            //console.log(data);
            const pId=data.rows
            pool.query('SELECT name FROM property WHERE id IN $1',[])
            res.render("showtransactions",{id:propertyid,uid:customerid,data:data});
            
        })
    }


    const buy = (req, res) => {
        var date = new Date();
        var key = {pid:propertyid, cid:customerid} ;
        //token = crypto.createHmac('sha1', toString(key)).update(toString(text)).digest('hex');        
        token = hash(key);
        console.log(token);
        pool.query('INSERT INTO transaction (token,propertyid,price,date,userid) VALUES ($1,$2,$3,$4,$5)',[token,propertyid,propertycost,date,customerid],(err,info)=>{
            res.redirect("/transaction");
        })
    }

    const myproperties = (req,res)=>{
        pool.query('SELECT * FROM property WHERE ownerid=$1',[customerid],(err,result)=>{
            res.render("myproperties",{result:result});
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
    showtrasaction,
    buy,
    myproperties,
    showrent
  }