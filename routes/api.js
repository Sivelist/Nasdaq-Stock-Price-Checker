/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var request = require('request');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app,db) {

  app.route('/api/stock-prices')
    .get(function (req, res){
    var stockSymbol = req.query.stock;
    var url = 'https://ws-api.iextrading.com/1.0/tops/last?symbols=';
    var stockData;
    var bodyJson;
    var bodyJson2;
    var likeQuery = req.query.like;
    var likeBool;
    var stockLikes;
    var stockRL = [];

    function done(){
      console.log('done function starting..');
    request(url + stockSymbol[0], function(err2,res2,body2){
      request(url + stockSymbol[1], function(err3,res3,body3){
        bodyJson = JSON.parse(body2);
        bodyJson2 = JSON.parse(body3);

        stockData = [{stock: bodyJson[0].symbol, price: bodyJson[0].price.toString(), rel_likes: stockRL[0] - stockRL[1]}, {stock: bodyJson2[0].symbol, price: bodyJson2[0].price.toString(), rel_likes:stockRL[1] - stockRL[0]}];
        res.send(stockData);

      });
    });
  };
    // 1 stock case
    if(Array.isArray(stockSymbol) == false){
    
    request(url + stockSymbol, function(err2,res2,body2){
      bodyJson = JSON.parse(body2);
      
      db.db('test').collection('stock').findOne({stock: stockSymbol}, (err,result) =>{
        if(err){
          console.log('error finding stock');
        } else if (result == null) {
          console.log('stock not found, creating now..')
          db.db('test').collection('stock').insertOne({
            stock: stockSymbol,
            likes: 0,
            likeIps:[]
          });
          if (likeQuery == 'true'){
            db.db('test').collection('stock').updateOne({stock: stockSymbol},{$inc:{likes: +1}});
            db.db('test').collection('stock').updateOne({stock: stockSymbol},{$push:{likeIps: req.ip}});
            stockLikes = 1;
            stockData = {stock: bodyJson[0].symbol, price: bodyJson[0].price.toString(), likes: stockLikes};
            res.send(stockData);
          }else{
          stockLikes = 0;
          stockData = {stock: bodyJson[0].symbol, price: bodyJson[0].price.toString(), likes: stockLikes};
          res.send(stockData);
          };

        } else { 
          
          if(likeQuery == 'true'){
            console.log(result.likeIps.includes(req.ip));
            if(result.likeIps.includes(req.ip) == false){
            db.db('test').collection('stock').updateOne({stock: stockSymbol},{$inc:{likes: +1}});
            db.db('test').collection('stock').updateOne({stock: stockSymbol},{$push:{likeIps: req.ip}});
            stockLikes = result.likes + 1;
            stockData = {stock: bodyJson[0].symbol, price: bodyJson[0].price.toString(), likes: stockLikes};
            res.send(stockData);
            }else{
              stockLikes = result.likes; 
              stockData = {stock: bodyJson[0].symbol, price: bodyJson[0].price.toString(), likes: stockLikes, msg:"you have liked this stock before."};
              res.send(stockData);
            }
              
          }else{
            stockLikes = result.likes; 
            stockData = {stock: bodyJson[0].symbol, price: bodyJson[0].price.toString(), likes: stockLikes};
            res.send(stockData);
          }
        };
      });
    });
    
      
      
    // 2 stock case
    } else if (Array.isArray(stockSymbol) == true){
      
      // if any stock in array does not exist on database, create the entry
      
//       //declaring find promises
//       var findPromise = (stockItem) => {
//         return new Promise((resolve,reject)=>{
//           db.db('test').collection('stock').findOne({stock: stockItem}, (err,result)=>{
//             if(err){
//               reject(err);
//             }else{
//               resolve(result);
//             }
//           });
//         });
//       };
      
//       //create async promise handler for find promise
//       var callFindPromise = async (stockItem) => {
//         var result = await (findPromise(stockItem));
//         return result;
//       };
      
//       //declaring insertOne promise
//       var insertPromise = (stockItem) =>{
//         return new Promise((resolve,reject)=>{
//           db.db('test').collection('stock').insertOne({
//             stock: stockItem,
//             likes: 0,
//             likeIps:[]
//           });
//           resolve(stockItem);
//         });
//       };
      
//       //create async promise handler for insertOne promise
//       var callInsertPromise = async (stockItem) => {
//         var result = await (insertPromise(stockItem));
//         return result;
//       };
      
//       //declaring updateOne promise
//       var updatePromise = (stockItem) =>{
//         return new Promise((resolve,reject)=>{
//           db.db('test').collection('stock').updateOne({stock: stockItem},{$inc:{likes: +1}});
//           db.db('test').collection('stock').updateOne({stock: stockItem},{$push:{likeIps: req.ip}});
//           resolve(stockItem);
//         });
//       };
      
//       //create async promise handler for updateOne promise
//       var callUpdatePromise = async (stockItem) => {
//         var result = await (updatePromise(stockItem));
//         return result;
//       };
      
      
      //call the promise 

      console.log(likeQuery);
      if(likeQuery == undefined){
        
        (async function loop(){
          for (let i = 0; i < stockSymbol.length;){
            await new Promise (function (resolve, reject){
              console.log('step 1 promise: ', stockSymbol[i], ', i = ', i);
              resolve(stockSymbol[i]);
              
            }).then(function(promise){
              
              return new Promise(function (resolve,reject){
                db.db('test').collection('stock').findOne({stock: promise}, (err,result)=>{
                  if (err){
                    console.log('err');
                  }else{
                    console.log('step 2 promise: ', result, ', i = ', i);
                    resolve(result);
                  }
                });
              });
              
            }).then(function(promise){
              
              return new Promise(function (resolve,reject){
                if (promise == null) {
                  db.db('test').collection('stock').insertOne({
                    stock: stockSymbol[i],
                    likes: 0,
                    likeIps:[]
                  })
                  console.log('step 3 promise(null): ', promise, ', i = ', i);
                  resolve({
                    stock: stockSymbol[i],
                    likes: 0,
                    likeIps:[]
                  })
                } else {
                  console.log('step 3 promise(not null): ', promise, ', i = ', i);
                  resolve(promise);
                } 
              });
            }).then(function (promise){
              
              return new Promise(function (resolve, reject){
                
                stockRL[i] = promise.likes;
                
                console.log('step 4 promise: ', promise, ', stockRL : ',stockRL[i], ', i = ', i);
                resolve(promise);
                
                
              });
            }).then((promise)=>{
              
              i++;
              console.log('step 5 promise: ', promise, ', i = ', i);
              if (i == stockSymbol.length){
                
                done();
              };
              return promise;
            });
          }
        })();
        
        
        
      }else{
        
        // console.log('like checked');      
        (async function loop(){
          for (let i = 0; i < stockSymbol.length;){
            await new Promise (function (resolve, reject){
              console.log('step 1 promise: ', stockSymbol[i], ', i = ', i);
              resolve(stockSymbol[i]);
              
            }).then(function(promise){
              
              return new Promise(function (resolve,reject){
                db.db('test').collection('stock').findOne({stock: promise}, (err,result)=>{
                  if (err){
                    console.log('err');
                  }else{
                    console.log('step 2 promise: ', result, ', i = ', i);
                    resolve(result);
                  }
                });
              });
              
            }).then(function(promise){
              
              return new Promise(function (resolve,reject){
                if (promise == null) {

                  console.log('step 3a promise(null): ', promise, ', i = ', i);
                  resolve(
                  db.db('test').collection('stock').insertOne({
                    stock: stockSymbol[i],
                    likes: 0,
                    likeIps:[]
                  })
                  )
                } else {
                  console.log('step 3a promise(not null): ', promise, ', i = ', i);
                  resolve(promise);
                } 
              });
            }).then(function (promise){
              
              return new Promise(function (resolve,reject){
                db.db('test').collection('stock').findOne({stock: stockSymbol[i]}, (err,result)=>{
                  if (err){
                    console.log('err');
                  }else{
                    // console.log('step 3b promise: ', result, ', i = ', i);
                    resolve(result);
                  }
                });
                
              });
            }).then(function (promise){
              
              return new Promise(function (resolve,reject){
                
                console.log('break point 1 :', promise.likeIps.includes(req.ip) );
                
                if(promise.likeIps.includes(req.ip) == false){
                  console.log('break point 1b');
                  resolve(
                 db.db('test').collection('stock').updateOne({stock: stockSymbol[i]},{$inc:{likes: +1}})
                  );
                }else{
                 resolve(promise);
                }
                
              });
            }).then(function (promise){
              
              return new Promise(function (resolve,reject){
                db.db('test').collection('stock').findOne({stock: stockSymbol[i]}, (err,result)=>{
                  if (err){
                    console.log('err');
                  }else{
                    // console.log('step 3b promise: ', result, ', i = ', i);
                    resolve(result);
                  }
                });
                
              });
            }).then(function (promise){
              
              return new Promise(function (resolve,reject){
                
                console.log('break point 2 :', promise.likeIps.includes(req.ip) );
                
                if(promise.likeIps.includes(req.ip) == false){
                  resolve(
                 db.db('test').collection('stock').updateOne({stock: stockSymbol[i]},{$push:{likeIps: req.ip}})
                  );
                }else{
                 resolve(promise);
                }
                
              });
            }).then(function (promise){
              
              return new Promise(function (resolve,reject){
                db.db('test').collection('stock').findOne({stock: stockSymbol[i]}, (err,result)=>{
                  if (err){
                    console.log('err');
                  }else{
                    console.log('step 3b promise: ', result, ', i = ', i);
                    resolve(result);
                  }
                });
                
                
              });
              
              
            }).then(function (promise){
              
              return new Promise(function (resolve, reject){
                
                stockRL[i] = promise.likes;
                
                console.log('step 4 promise: ', promise, ', stockRL : ',stockRL[i], ', i = ', i);
                resolve(promise);
                
                
              });
            }).then((promise)=>{
              
              i++;
              console.log('step 5 promise: ', promise, ', i = ', i);
              if (i == stockSymbol.length){
                
                done();
              };
              return promise;
            });
          }
        })();
        
        
        
      }
      
    } else {
      console.log('really funky error..')
    };
    
    
    
    
    })
};

