'use strict';
/*
  Parameter Checking checkBody Tests
*/
const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const checkBody = require('../index').checkBody;
const checkParam = require('../index').checkParam;

let request = {};
let response = {};

describe('Check Parameter checkBody', ()=>{
  beforeEach((done)=>{
    /*
     * before each test, reset the request and response variables
     * to be send into the middle ware
    **/
    request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
            myid: '312'
        }
    });
    response = httpMocks.createResponse();

    done(); // call done so that the next test can run
  });
  it('should not return an error', (done) =>{
    checkBody([])(request, response, function next(error) {
      if (error) { throw error }
      done(); // call done so we can run the next test
    });
  });
  it('should not have an error when all parameters are present', (done)=>{
    const params = {message:'Hi', rates: 2};
    request.body = params;
    checkBody(['message', 'rates'])(request, response, function next(error) {
      if (error) { throw error }
      done(); // call done so we can run the next test
    });
  });
  it('should have an error when all parameters are present', (done)=>{
    const params = {message:'Hi'};
    request.body = params;
    checkBody(['message', 'rates'])(request, response, function next(error) {
      expect(error).to.be.ok;
      expect(response.statusCode).to.equal(400);
      done(); // call done so we can run the next test
    });
  });
  it('should not have an error when passed a deep object if present', (done)=>{
    const params = {list: {name: 'Jeff'}};
    request.body = params;
    checkBody(['list.name'])(request, response, function next(error) {
      if (error) { throw error }
      done(); // call done so we can run the next test
    });
  });
  it('should have an error when root object is not present', (done)=>{
    const params = {list: undefined};
    request.body = params;
    checkBody(['list.name'])(request, response, function next(error) {
      expect(error).to.be.ok;
      expect(response.statusCode).to.equal(400);
      done(); // call done so we can run the next test
    });
  });
  it('should have an error when nested object is not present', (done)=>{
    const params = {list: {bill: true}};
    request.body = params;
    checkBody(['list.name'])(request, response, function next(error) {
      expect(error).to.be.ok;
      expect(response.statusCode).to.equal(400);
      done(); // call done so we can run the next test
    });
  });
});
describe('Check Parameter checkParams', ()=>{
  beforeEach((done)=>{
    /*
     * before each test, reset the request and response variables
     * to be send into the middle ware
    **/
    request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?id=312',
        query: {
            id: '312'
        }
    });
    response = httpMocks.createResponse();

    done(); // call done so that the next test can run
  });
  it('should allow id', (done) => {
    request.params.id = request.query.id;
    checkParam(['id'])(request, response, function next(error){
      if (error) { throw error }
      done(); // call done so we can run the next test
    });
  });
  it('shouldnt allow non present', (done) => {
    request.params.id2 = request.query.id2;
    checkParam(['id2'])(request, response, function next(error){
      expect(error).to.be.ok;
      expect(response.statusCode).to.equal(400);
      done(); // call done so we can run the next test
    });
  });
});