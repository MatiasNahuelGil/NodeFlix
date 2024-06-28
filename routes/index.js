const express = require('express');
const router = express.Router();


const mysql = require('mysql2');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '*****',
    database: 'nodeflix'
});

connection.connect();


/* GET Home page */
router.get('/', function(req, res, next) {

  connection.query('select * from peliculas', function (error,
    results,fields){
     
        if (error) throw error;
      //  res.json({data: results});
     
       res.render('index',{data:results});
    });

});

module.exports = router;
