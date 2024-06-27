var express = require('express');
var router = express.Router();


//
const multer = require('multer')
const upload = multer({dest: 'uploads/'});
const fs = require('fs');

//conección a base de datos
var mysql = require('mysql2');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Matias-619',
    database: 'nodeflix'
});

connection.connect();


/* GET favoritos page */
router.get('/', function(req, res, next) {

  connection.query('select * from peliculas', function (error,
    results,fields){
     
        if (error) throw error;
      //  res.json({data: results});
     
       res.render('favoritos',{data:results});
    });
 

});

router.get('/viendoPelicula',function(req,res,next){
    res.render('viendoPelicula')
  });

router.get('/alta',function(req,res,next){
  res.render('altaPelicula')
});



 
router.post('/alta',upload.single('imagen'),async function(req,res,next){
  let sentencia = `insert into peliculas (genero_id,titulo,descripcion,imagen) values ('${req.body.genero_id}','
  ${req.body.titulo}','${req.body.descripcion}','/images/${req.file.originalname}')`

  let results =  connection.query(sentencia)
  

  //Copiamos el archivo de upload a images
  fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})


  res.render("finalizado", {mensaje: "Pelicula agregada exitosamente"})
})


router.get('/modificar/:id',function(req,res,next){
  connection.query('select * from peliculas where id = ' + req.params.id, function (error,
    results,fields){
      
        if (error) throw error;
      //  res.json({data: results});
      
       res.render('modificar',{data:results});
    });
})




router.post('/modificar/:id',upload.single('imagen'),async function(req,res,next){
  let sentencia;
if (req.file){

  sentencia =  `update peliculas set titulo  = '${req.body.titulo}', descripcion  = '${req.body.descripcion}', imagen = '/images/${req.file.originalname}' 
  where id = ${req.params.id} `

  fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})

} else {
 sentencia = `update peliculas set titulo  = '${req.body.titulo}', descripcion  = '${req.body.descripcion}' where id = ${req.params.id}` 
}  

connection.query(sentencia, function (error, results, fields) {

 if (error) throw error;
 // res.json({data: results})
 
 res.render('finalizado', {mensaje:"El producto fue modificado exitosamente"});

  
});

  
  
})

router.get('/eliminar/:id', function (req, res, next){

connection.query('select * from peliculas where id = ' + req.params.id, function (error, results, fields) {

 if (error) throw error;
 // res.json({data: results})
 res.render('eliminar', {data:results});
});
})

router.post('/eliminar/:id', function (req, res, next){

connection.query('delete from peliculas where id = ' + req.params.id, function (error, results, fields) {

 if (error) throw error;
 // res.json({data: results})
 res.render('finalizado', {mensaje:"El producto fue eliminado exitosamente"});
});
})




module.exports = router;