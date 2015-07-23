var models = require('../models/models.js');
//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req,res,next,quizId) {
    models.Quiz.findById(quizId).then(
        function(quiz){
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe quizId='+quizId));
            }
        }
    ).catch(function(error){next(error);});
};

//GET /quizes
exports.index = function(req,res,next) {
    var consulta={};
    
    if (req.query.search === undefined){
        consulta={order: "pregunta"};
    }
    else {
        var buscar;
        buscar = '%' + req.query.search.replace(' ','%') + '%';       
        consulta = {where:["pregunta LIKE ?", buscar], order:"pregunta"};
    }
    
     models.Quiz.findAll(consulta).then(
            function(quizes){            
                res.render('quizes/index', varRetorno={quizes: quizes, filtro: req.query.search});
            }
        ).catch(function(error){next(error);});
};

//GET /quizes/:id
exports.show = function(req,res) {
    res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/:id/answer
exports.answer = function(req,res) {
    var resultado = 'Incorrecto';
    
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    } 
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};