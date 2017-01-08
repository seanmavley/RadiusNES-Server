let mongoose = require("mongoose");
let Users = require('../models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the database
    Users.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe('/GET users', () => {
    it('it should GET all the public to authenticate users', (done) => {
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */ 

  describe('/POST users', () => {
    it('it should return error when posting', (done) => {
      let user = {
        username: "username",
        password: "password"
      }

      chai.request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
        done();
        })
    })
  })


});
