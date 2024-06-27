var express = require('express');
var router = express.Router();


var mysql = require('mysql2');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Matias-619',
    database: 'nodeflix'
});

connection.connect();


/* GET movies page */
router.get('/', function(req, res, next) {

  connection.query('select * from peliculas', function (error,
    results,fields){
     
        if (error) throw error;
      //  res.json({data: results});
     
       res.render('movies',{data:results});
    });

});

module.exports = router;