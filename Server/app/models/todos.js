// =============================================================================== Todo Schema ================================================================================================

// Declare variables
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

// Define properties 
var TodoSchema = new Schema({  
    user: {type: Schema.Types.ObjectId, required: true},
    todo: {type: String, required: true},             
    description: {type: String},
    priority: {type: String},
    dateCreated: {type: Date, default: Date.now},
    dateDue: {type: Date, default: Date.now},
    completed: {type:Boolean, default: false},
    file: {filename: String, originalName: String, dateUploaded: Date } 
  });
  
// Create and export the model
module.exports = Mongoose.model('Todo', TodoSchema);
  