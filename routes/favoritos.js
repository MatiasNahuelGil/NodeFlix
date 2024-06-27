//llamado a express

const express = require('express');
const router = express.Router();


//Utilizando multer
const multer = require('multer')
const upload = multer({dest: 'uploads/'});
const fs = require('fs');

//conección a base de datos
const  mysql = require('mysql2');
const  connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Matias-619',
    database: 'nodeflix'
});

connection.connect();


/*Ruta para ver favoritos */
router.get('/', function(req, res, next) {
 /*Seleccionamos todas las peliculas*/
  connection.query('select * from peliculas', function (error,
    results,fields){
     
        if (error) throw error;
       res.render('favoritos',{data:results});
    });
 

});

/*Ruta para ver la pelicula */
router.get('/viendoPelicula',function(req,res,next){
    res.render('viendoPelicula')
  });

/*Ruta para ver el formulario del alta */
router.get('/alta',function(req,res,next){
  res.render('altaPelicula')
});



/*METODO CREATE */
router.post('/alta',upload.single('imagen'),async function(req,res,next){
  let sentencia = `insert into peliculas (genero_id,titulo,descripcion,imagen) values ('${req.body.genero_id}','
  ${req.body.titulo}','${req.body.descripcion}','/images/${req.file.originalname}')`

  let results =  connection.query(sentencia)
  

  //Copiamos el archivo de upload a images
  fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})

  /*Renderizamos la vista cuando se carga exitosamente */
  res.render("finalizado", {mensaje: "Pelicula agregada exitosamente"})
})


/*METODO UPDATE */
router.get('/modificar/:id',function(req,res,next){
  connection.query('select * from peliculas where id = ' + req.params.id, function (error,
    results,fields){
      /*Renderizamos la vista modificar para ver el formulario */
        if (error) throw error;
       res.render('modificar',{data:results});
    });
})

router.post('/modificar/:id',upload.single('imagen'),async function(req,res,next){
      let sentencia;
     if (req.file){
  /*Creamos una sentencia para actualizar  los datos mostrados */
     sentencia =  `update peliculas set titulo  = '${req.body.titulo}', descripcion  = '${req.body.descripcion}', imagen = '/images/${req.file.originalname}' 
      where id = ${req.params.id} `
   /*Enviamos la foto a la carpeta uploads y luego lo redigimos a la carpeta images*/
      fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})

    } else {
       sentencia = `update peliculas set titulo  = '${req.body.titulo}', descripcion  = '${req.body.descripcion}' where id = ${req.params.id}` 
   }  

     connection.query(sentencia, function (error, results, fields) {
             if (error) throw error;
             res.render('finalizado', {mensaje:"El producto fue modificado exitosamente"});

             });
})



/*METODO DELETE */

router.get('/eliminar/:id', function (req, res, next){

        connection.query('select * from peliculas where id = ' + req.params.id, function (error, results, fields) {
           if (error) throw error;
                res.render('eliminar', {data:results});
           });
        })

        router.post('/eliminar/:id', function (req, res, next){

        connection.query('delete from peliculas where id = ' + req.params.id, function (error, results, fields) {
           if (error) throw error;
        res.render('finalizado', {mensaje:"El producto fue eliminado exitosamente"});
         });
});




module.exports = router;