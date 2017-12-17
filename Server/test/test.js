// Set the env variable to 'test' during the testing
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();

// Tell chai to use the http module so it can communicate with the server
chai.use(chaiHttp);

// Define the tests for index.html and 404 error handler
describe('Test', function() {
  it('/GET index.html');
  it('/GET 404');
});

// Create a test that ensures html files can be loaded
it('it should GET the index.html file', (done) => {
    chai.request(server)
        .get('/index.html')
        .end((err, res) => {
            res.should.have.status(200);         // the http status will be 200, the content is an html file
            res.should.be.html();
        done();                                  // done() indicates the test is complete          
        });
});

// Test for 404 Error Handler
it('it should return 404', (done) => {            
    chai.request(server)		
        .get('/index.html2')  
        .end((err, res) => {
            res.should.have.status(404);        // Add the test with one assertion    
        done();
        });
});

// =============================================================================== Testing User API ============================================================================================

// Add mongoose and Todo and User models
var mongoose = require("mongoose");            
User = require('../app/models/users');
Todo = require('../app/models/todos');

// Define the tests for User API
describe('User', () => {                       // This code deletes any existing User collection in the todos-test database before each run of the tests    
beforeEach((done) => { 
    User.remove({}, (err) => {
        done();
    });
});

// Testing POST
it('it should POST a user', (done) => {
    var user = {                              // Define a valid document        
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "woo@hoo.com",
        "password": "pass"
    } 
        .post('/api/users')                   // Perform the POST and then check the results
        .send(user)
        .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('firstName');
            res.body.firstName.should.be.a('string');
            res.body.firstName.should.equal('Jane');
            done();
        });
});

// Testing POST with a missing required field
it('it should not POST a user without email field', (done) => {
	var user = {
		"firstName": "Jane",
		"lastName": "Doe",
		"password": "pass"
	};
	chai.request(server)
		.post('/api/users')
		.send(user)
		.end((err, res) => {
			res.should.have.status(500);
			done();
		});
});

// Testing GET all users
it('it should GET all the users', (done) => {
      var user = new User({
              "firstName": "Jane",
              "lastName": "Doe",
              "email": "JaneDoe@hoo.com",
              "password": "pass"
            });
      user.save((err, user) => {
          chai.request(server)
              .get('/api/users')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
                  done();
            });       
      });
});

// Testing GET for a user with _id
it('it should GET a user by the given id', (done) => {
	var user = new User({
            		"firstName": "Jane",
            		"lastName": "Doe",
            		"email": "JaneDoe@hoo.com",
            		"password": "pass"
        	});
	user.save((err, user) => {
		chai.request(server)
			.get('/api/users/' + user._id)
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('firstName');
				res.body.should.have.property('lastName');
				res.body.should.have.property('email');
				res.body.should.have.property('password');
				res.body.should.have.property('_id').eql(user._id.toString());
				done();
			});
	  });
});

// Testing UPDATE
it('it should UPDATE a user', (done) => {
      var user = new User({
                "firstName": "Jane",
                "lastName": "Doe",
                "email": "yoo@hoo.com",
                "password": "pass"
            });
      user.save((err, user) => {
          chai.request(server)
              .put('/api/users/' + user._id)
              .send({
                   "_id": user._id,
                   "firstName": "Joey",
                   "lastName": "Doe",
                   "email": "yoo@hoo.edu",
                   "password": "pass"
                 })
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('email').eql('yoo@hoo.edu');
                  res.body.should.have.property('firstName').eql('Joey');
                  done();
           }); 
      }); 
});
        
// Testing DELETE
it('it should DELETE a user given the id', (done) => {
        var user = new User({
                  "firstName": "Jane",
                  "lastName": "Doe",
                  "email": "five@hoo.com",
                  "password": "pass"
            });
        user.save((err, user) => {
            chai.request(server);
            delete('/api/users/' + user._id)
            .end((err, res) => {
                res.should.have.status(200);
                done();

        });
    });
});
           
// =============================================================================== Testing Todo API ============================================================================================

// Define the tests for Todo API
describe('Todo', () => {
        beforeEach((done) => { 
            Todo.remove({}, (err) => {
                done();
            });
        });
        var user = new User({
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "JaneDoe@hoo.com",
            "password": "pass"
        });
        user.save((err, user) => {
                USER_ID = user._id;  // USER_ID is available for all tests 
        });

// Testing POST for todos
it('it should POST a todo', (done) => {
         var todo = {
             "userId": USER_ID,
             "todo": "This is my Todo"
         };       
           chai.request(server)
               .post('/api/todos')
               .send(todo)
               .end((err, res) => {            
                   res.should.have.status(201);
                   res.body.should.have.property('todo');
                   res.body.todo.should.be.a('string');
                   res.body.todo.should.equal('This is my Todo');
                   done();
               });
       });

// Testing GET a user’s todos
it('it should GET a users todos', (done) => {
        var todo = new Todo({
            "userId": USER_ID,
            "todo": "This is my Todo"
        });
        todo.save((err, todo) => {      
            chai.request(server)
                .get('/api/todos/user/' + USER_ID)
                .end((err, res) => {            
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

// Testing GET a todo
it('it should GET a todo', (done) => {
            var todo = new Todo({
                "userId": USER_ID,
                "todo": "This is my Todo"
            });
            todo.save((err, todo) => {      
                chai.request(server)
                    .get('/api/todos/' + todo._id)
                    .end((err, res) => {            
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('userId');
                        res.body.should.have.property('todo');
                        res.body.should.have.property('completed');
                        res.body.should.have.property('dateCreated');
                        res.body.should.have.property('_id').eql(todo._id.toString());
                        done();
                    });
            });
        });

// Testing UPDATE a todo
it('it should UPDATE a todo', (done) => {
            
            var todo = new Todo({
                "userId": USER_ID,
                "todo": "This is my Todo",
                "description": "This is a description"
            });
            todo.save((err, todo) => {
                chai.request(server)
                    .put('/api/todos/' + todo._id)
                    .send({
                         "_id": todo._id,
                         "userId":USER_ID,
                         "todo": "Get it done!",
                         "description": "I don't need a description",
                         })
                     .end((err, res) => {
                         res.should.have.status(200);
                         res.body.should.be.a('object');
                         res.body.should.have.property('todo').eql('Get it done!');
                         res.body.should.have.property('description').eql("I don't need a description");
                         done();
                     });
              });
          }); 

// Testing DELETE a todo
it('it should DELETE a todo given the id', (done) => {
            var todo = new Todo({
                "userId": USER_ID,
                "todo": "This is my Todo",
                "description": "This is a description"
            });
            todo.save((err, todo) => {
                chai.request(server)
                    .delete('/api/todos/' + todo._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                       	done();
                    });
            });
        });
    
});
});
