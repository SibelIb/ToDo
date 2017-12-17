// =============================================================================== User Schema ================================================================================================

// Declare variables
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var Bcrypt = require('bcryptjs');


// Define properties 
var userSchema = new Schema({                       
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    status: {type:Boolean, default: true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    dateRegistered: {type: Date, default: Date.now}
  });
  

// Password encryption
  userSchema.pre('save', function (next) {                                // Executes before a document is saved    
    var person = this;
    if (this.isModified('password') || this.isNew) {                      // If the user is new or password is modified     
       Bcrypt.genSalt(10, function (err, salt) {                          // Generate the salt
            if (err) { 
               return next(err); 
           }
            Bcrypt.hash(person.password, salt, function (err, hash) {     // Encrypt the password              
                if (err) {
                    return next(err);
                }
                person.password = hash;
                next();
            });
        });
    } else { 
       return next();
    }
});

userSchema.methods.comparePassword = function (passw, cb) {                 // Password submitted by user  
  Bcrypt.compare(passw, this.password, function (err, isMatch) {            // Password in database    
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};


// Create and export the model
module.exports = Mongoose.model('User', userSchema);
  