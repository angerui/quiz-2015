var path = require('path');

//Postgress DATABASE_URL = postgress://user:passwd@host:port/database
//SQLite    DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user    = (url[2]||null);
var pwd     = (url[3]||null);
var protocol= (url[1]||null);
var dialect = (url[1]||null);
var port    = (url[5]||null);
var host    = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Carga Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd, 
                              {dialect: protocol, 
                               protocol: protocol,
                               port: port,
                               host: host,
                               storage: storage,  // solo SQLite (.env)
                               omitNull: true     // solo Postgress
                               }
                             );

//Importar la deficición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar la deficición de la tabla Comment en comment.js
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Definición de la relación 1-a-N entre Quiz y Comment
Comment.belongsTo(Quiz);    //Los comentarios pertenecen a los quizes
Quiz.hasMany(Comment);      //Un quiz puede tener muchos comentarios

exports.Quiz = Quiz;  //exportar definción de tabla Quiz
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
    //then(...) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function(count){
        if (count === 0 ) {  // la tabla se inicializa sólo si está vacía
            Quiz.create({ pregunta: 'Capital de Italia',
                          respuesta: 'Roma',
                          tema: 'ocio'
                        })
            .then(function(){console.log('Base de datos inicializada')});
        };
    });
});