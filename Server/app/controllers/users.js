// =============================================================================== User Route Handlers ================================================================================================

// Import the User model
mongoose = require('mongoose');                         
User = mongoose.model('User');        

// Define router
var express = require('express');
var router = express.Router();

// Define logger
logger = require('../../config/logger');

// Login route and authentication
passportService = require('../../config/passport');
passport = require('passport');

var requireLogin = passport.authenticate('local', { session: false });
var requireAuth = passport.authenticate('jwt', { session: false });


// Routes start here

module.exports = function (app, config) {
app.use('/api', router);

// Route to handle the post request from the /login url
router.route('/users/login').post(requireLogin, login);
    
    
// User POST Handler - Create a user
router.post('/users', function (req, res, next) {
      logger.log('Create user', 'verbose');
      var user = new User(req.body);                   // Create a new user object from the data sent in the request using the User model
      user.save()                                      // Save the user and if there is no error send the user data back with code 201      
      .then(result => {
          res.status(201).json(result);
      })
      .catch(err => {                                   // The catch block is executed if an error occurs        
        return next(err);
      });
    });


// GET All Users Handler - Get all users
router.get('/users', function (req, res, next) {
      logger.log('Get users', 'verbose');
      var query = User.find()                           // Create a query object using the User model’s find method      
        .sort(req.query.order)                          // Sort if the url has an order property query parameter        
        .exec()                                         // Execute the query then send back the result or catch any errors         
        .then(result => {
         	if(result && result.length) {
			       res.status(200).json(result);
		      } else {
			      res.status(404).json({message: 'No users'});
	      	}
        })
        .catch(err => {
          return next(err);
        });
    });

    
// GET a User Handler - Get a user with id = userId
router.get('/users/:userId', requireAuth, function(req, res, next){
      logger.log('Get user ' + req.params.userId, 'verbose');
      User.findById(req.params.userId)                   // findById search for a document with an _id equal to the supplied value 
        .then(user => {
          if(user){
            res.status(200).json(user);
          } else {
            res.status(404).json({message: "No user found"});
          }
        })
         .catch(error => {
           return next(error);
        });
    }); 
   

// PUT Handler - Update a user with id = userId
router.put('/users/:userId',requireAuth, function(req, res, next){
    logger.log('Update user ' + req.params.userId, 'verbose');
    User.findOneAndUpdate({_id: req.params.userId}, 		 // Find the document with the same _id as the body      
    req.body, {new:true, multi:false})                   // Update it with the contents of the body      
        .then(user => {                                  // Return the updated document      
            res.status(200).json(user);
      })
       .catch(error => {
         return next(error);
      });
  }); 
  

  // PUT Handler - Update user password for a user with id = userId
router.put('/users/password/:userId', requireAuth, function(req, res, next){
  logger.log('Update user password' + req.params.userId, 'verbose');
  User.findById(req.params.userId)
    .exec()
    .then(function (user) {
      if(req.body.password !== undefined) {
        user.password = req.body.password;
      }
  user.save()
      .then(function (user) {
          res.status(200).json(user);
      })
       .catch(function (err) {
       return next(err);
      });
   })
      .catch(function (err) {
      return next(err);
      });
});


// DELETE Handler - Delete a user with id = userId
router.delete('/users/:userId', requireAuth, function(req, res, next){
      logger.log('Delete user ' + req.params.userId, 'verbose');
      User.remove({ _id: req.params.userId })
            .then(user => {
                res.status(200).json({msg: 'User Deleted'});
        })
          .catch(error => {
             return next(error);
        });
    });

  
  // DELETE Handler - Delete all users
router.delete('/users', function(req, res, next){
     logger.log('Delete users ' + req.params.userId, 'verbose');
     var query = User.remove() 
    .sort(req.query.order)                          // Sort if the url has an order property query parameter        
    .exec()                                         // Execute the query then send back the result or catch any errors         
    .then(result => {
        if(result && result.length) {
        res.status(200).json(result);
       }else {
       res.status(404).json({message: 'No users'});
      }
     })
      .catch(err => {
      return next(err);
     });
   });


};
  
  