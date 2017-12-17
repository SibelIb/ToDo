// =============================================================================== Todo Route Handlers ================================================================================================

// Import the Todo model
mongoose = require('mongoose');                         
Todo = mongoose.model('Todo');        

// Define router
var express = require('express');
var router = express.Router();

// Define logger
logger = require('../../config/logger');

// Authentication
passportService = require('../../config/passport');
passport = require('passport');

var requireAuth = passport.authenticate('jwt', { session: false });

// Require file upload modules
multer = require('multer');
mkdirp = require('mkdirp');

module.exports = function (app, config) {
app.use('/api', router);


// Todo POST Handler - Create a todo
router.post('/todos', function (req, res, next) {
      logger.log('Create todo', 'verbose');
      var todo = new Todo(req.body);                   // Create a new todo object from the data sent in the request using the Todo model
      todo.save()                                      // Save the todo and if there is no error send the todo data back with code 201      
      .then(result => {
          res.status(201).json(result);
      })
      .catch(err => {                                   // The catch block is executed if an error occurs        
        return next(err);
      });
    });


// File uploads
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {      
              var path = config.uploads + req.params.userId + "/";
            mkdirp(path, function(err) {
                if(err){
                    res.status(500).json(err);
                } else {
                    cb(null, path);
                }
            });
        },
        filename: function (req, file, cb) {
            let fileName = file.originalname.split('.');   
            cb(null, fileName[0] + new Date().getTime() + "." + fileName[fileName.length - 1]);
        }
      });
    
    var upload = multer({ storage: storage });

    router.post('/todos/upload/:userId/:todoId', upload.any(), function(req, res, next){
          logger.log('Upload file for todo ' + req.params.todoId + ' and ' + req.params.userId, 'verbose');
          
    Todo.findById( req.params.todoId, function(err, todo){
                  if(err){ 
                      return next(err);
                  } else {     
                      if(req.files){
                          todo.file = {
                              filename : req.files[0].filename,
                              originalName : req.files[0].originalname,
                              dateUploaded : new Date()
                          };
                      }           
                      todo.save()
                          .then(todo => {
                              res.status(200).json(todo);
                          })
                          .catch(error => {
                              return next(error);
                          });
                  }
             });
    }); 


// GET All Todos for a User Handler - Get all todos for a user with id = userId
router.get('/todos/user/:userId', function (req, res, next) {
    logger.log('Get todos for user'+ req.params.userId, 'verbose');
    Todo.find({ user: req.params.userId })                      // findById search for a document with an _id equal to the supplied value      
    .then(todo => {
        if(todo){
           res.status(200).json(todo);
        } else {
           res.status(404).json({message: "No todos found for this user"});
        }
       })
       .catch(error => {
         return next(error);
       });
    }); 


// GET a Todo Handler - Get a todo with id = todoId
router.get('/todos/:todoId', function(req, res, next){
      logger.log('Get todo ' + req.params.todoId, 'verbose');
      Todo.findById(req.params.todoId)                   // findById search for a document with an _id equal to the supplied value 
        .then(todo => {
          if(todo){
            res.status(200).json(todo);
          } else {
            res.status(404).json({message: "No todo found"});
          }
        })
       .catch(error => {
         return next(error);
        });
    }); 
  

// PUT Handler - Update a todo with id = todoId
router.put('/todos/:todoId', function(req, res, next){
      logger.log('Update todo ' + req.params.todoId, 'verbose');
      Todo.findOneAndUpdate({_id: req.params.todoId}, 		 // Find the document with the same _id as the body      
      req.body, {new:true, multi:false})                     // Update it with the contents of the body      
          .then(todo => {                                    // Return the updated document      
              res.status(200).json(todo);
        })
         .catch(error => {
           return next(error);
        });
    }); 
   
    
// DELETE Handler - Delete a todo with id = todoId
router.delete('/todos/:todoId', function(req, res, next){
      logger.log('Delete todo ' + req.params.todoId, 'verbose');
      Todo.remove({ _id: req.params.todoId })
            .then(todo => {
                res.status(200).json({msg: 'Todo Deleted'});
        })
          .catch(error => {
             return next(error);
        });
    });
  


  };
  