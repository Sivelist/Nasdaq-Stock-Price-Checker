/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          
         assert.propertyVal(res.body,'stock','GOOG');
         assert.propertyVal(res.body,'price','1149.8');
         assert.propertyVal(res.body,'likes','0');
          //complete this one too
          
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog',
               like: 'true'})
        .end(function(err, res){
          
         assert.propertyVal(res.body,'stock','GOOG');
         assert.propertyVal(res.body,'price','1149.8');
         assert.propertyVal(res.body,'likes','1');
          //complete this one too
          
          done();
          });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog',
               like: 'true'})
        .end(function(err, res){
          
         assert.propertyVal(res.body,'stock','GOOG');
         assert.propertyVal(res.body,'price','1149.8');
         assert.propertyVal(res.body,'likes','1');
        assert.propertyVal(res.body,'msg',"you have liked this stock before.");
          //complete this one too
          
          done();
          });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query('stock=amzn&stock=msft')
        .end(function(err, res){
          
         assert.propertyVal(res.body[0],'stock','AMZN');
         assert.propertyVal(res.body[0],'price','2028.6');
         assert.propertyVal(res.body[0],'rel_likes','0');
         assert.propertyVal(res.body[1],'stock','MSFT');
         assert.propertyVal(res.body[1],'price','138.96');
         assert.propertyVal(res.body[1],'rel_likes','0');
          //complete this one too
          
          done();
          });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query('stock=amzn&stock=msft&like=true')
        .end(function(err, res){
          
         assert.propertyVal(res.body[0],'stock','AMZN');
         assert.propertyVal(res.body[0],'price','2028.6');
         assert.propertyVal(res.body[0],'rel_likes','0');
         assert.propertyVal(res.body[1],'stock','MSFT');
         assert.propertyVal(res.body[1],'price','138.96');
         assert.propertyVal(res.body[1],'rel_likes','0');
          //complete this one too
          
          done();
          });
      });
      
    });

});
