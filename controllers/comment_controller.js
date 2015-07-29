var models = require('../models/models.js');

//GET /quizes/:quizId/comments/new
exports.new = function(req,res) {
    res.render('comments/new.ejs', {quizid: req.params.quizId, pregunta: req.quiz.pregunta, errors: []});
};

//POST /quizes/:quizId/comments
exports.create = function(req,res) {
    var comment = models.Comment.build ( {texto: req.body.comment.texto,
                                          QuizId: req.params.quizId} );
    
    comment
    .validate()
    .then(
        function(err){
            if(err) {
                res.render('comments/new.ejs', {comment: comment, errors: err.errors});
            } else {
                    //save: guarda en BD campo texto de comment
                    comment.save().then(function(){
                        res.redirect('/quizes/'+req.params.quizId);
                    }) // res.redirect: Redirección HTTP a lista de preguntas
            }
        });
};
