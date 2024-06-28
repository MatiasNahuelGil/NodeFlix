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


/* GET movies page */
router.get('/', function(req, res, next) {

  connection.query('select * from peliculas', function (error,
    resultsMovies,fields){
     
        if (error){ 
          throw error;
        }
    connection.query('select * from genero', function (error,
      resultsGeneros,fields){
       
          if (error){
           throw error; 
          }
         res.render('movies',{genero:resultsGeneros, data:resultsMovies});
      });
    });

});

module.exports = router;
