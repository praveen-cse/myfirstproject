'use strict';
var fs = require("fs");
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const pgp = require("pg-promise")(),
dbConnection = require("./secrets/db_configuration"),
db = pgp(dbConnection),
redis = require("async-redis"),
client = redis.createClient();
const _ = require("lodash");
const init = async () => {
    const server = Hapi.server({
        port: 3000, host: 'localhost', "routes": {
            "cors": {
                origin: ["*"],
            }
        }
    });
    await server.register([{
          plugin: require('./my-scheme'),
        }])
      server.auth.strategy("my-strategy", "my-scheme", {name: 'pk',
      key : "helloooo"})
  
      server.ext('onPreAuth', function (request, h){
          console.log("This is in PreAuth");
          return h.continue;
      });
  
      server.ext('onPostAuth', function (request, h){
          console.log("This is in onPostAuth");
          return h.continue;
      });
    server.route({
        method: 'GET',
        path: '/{id}/{pass}',
        handler: async function (req, h) {
            var res=[]
            let command = "select * from user_details where username = $1 and password = $2";
            let values=[req.params.id,req.params.pass];
            await db
            .any(command,values)
            .then(data => {
                res = data;
                })
            .catch(error => console.log("ERROR:", error.detail));
                console.log(res);
                return res;
        },
        /*options: {
            auth: {strategy: 'my-strategy', mode: 'required'},
        }*/
    });
    server.route({
        method: 'POST',
        path: '/post',
        handler: async function (request, h) {
            const payload = request.payload;
            let promises=[];
            let result=[];
            let err="";
            let command =
                  "INSERT INTO user_details(username,fullname,password,phoneno,email) VALUES ($1,$2,$3,$4,$5)";
            let values = [payload.username,payload.fullname,payload.password,payload.phoneno,payload.email];
            promises.push(
            db
                .any(command, values)
                .then(data => {
                    result.push(values);
                })
                .catch(error => {err=error.detail;})
            );
            await Promise.all(promises);
            if (result.length==0){
                return {
                    "Err code" : "10003",
                    "Err Msg" : err
                };
            }
            return result;
        },
        /*options: {
            //auth: {strategy: 'my-strategy', mode: 'required'},
            validate: {
                payload: {
                    username : Joi.any().required(),
                    fullname: Joi.string().required(),
                    password: Joi.any().required(),
                    phoneno:Joi.number().max(10)
                }
            }
        }*/
    });
    server.route({
        method: 'POST',
        path: '/post-user',
        handler: async function (request, h) {
            const payload = request.payload;
            let promises=[];
            let result=[];
            let err="";
            let command =
                  "INSERT INTO user_actions(username,favorites,read_later,credits,status) VALUES ($1,$2,$3,$4,$5)";
            let values = [payload.username,'','',0,'active'];
            promises.push(
            db
                .any(command, values)
                .then(data => {
                    result.push(values);
                })
                .catch(error => {err=error.detail;})
            );
            await Promise.all(promises);
            return result;
        },
        /*options: {
            //auth: {strategy: 'my-strategy', mode: 'required'},
            validate: {
                payload: {
                    username : Joi.any().required(),
                    fullname: Joi.string().required(),
                    password: Joi.any().required(),
                    phoneno:Joi.number().max(10)
                }
            }
        }*/
    });
    server.route({
        method: 'POST',
        path: '/updateuser/{username}',
        handler: async function (request, h) {
            const payload = request.payload;
            let promises=[];
            let result=[];
            let username=request.params.username;
            let err="";
            let command =
                  "update user_details set fullname=$2,password=$3,phoneno=$4,email=$5 where username=$1";
            let values = [username,payload.fullname,payload.password,payload.phoneno,payload.email];
            promises.push(
            db
                .any(command, values)
                .then(data => {
                    result.push(values);
                })
                .catch(error => {err=error.detail;})
            );
            await Promise.all(promises);
            return result;
        },
    });
    server.route({
        method: 'POST',
        path: '/addquestion',
        handler: async function (request, h) {
            const payload = request.payload;
            let promises=[];
            let result=[];
            let err="";
            let command ="INSERT INTO question(question,questioner,hashtags) VALUES ($1,$2,$3)";
            let values = [payload.ques,payload.questioner,payload.hashtags];
            console.log(values);
            promises.push(
            db
                .any(command, values)
                .then(data => {
                    result.push(values);
                })
                .catch(error => {console.log(error);})
            );
            await Promise.all(promises);
            return result;
        },
        /*options: {
            //auth: {strategy: 'my-strategy', mode: 'required'},
            validate: {
                payload: {
                    username : Joi.any().required(),
                    fullname: Joi.string().required(),
                    password: Joi.any().required(),
                    phoneno:Joi.number().max(10)
                }
            }
        }*/
    });
    server.route({
        method: 'GET',
        path: '/getusercredentials/{username}',
        handler: async function (request, h) {
            var res=[];
            let command = "select * from user_actions where username = $1";
            let values=[request.params.username];
            await db
            .any(command,values)
            .then(data => {
                res = data;
                })
            .catch(error => console.log("ERROR:", error.detail));
                return res;
            }
        }),
        server.route({
            method : 'GET',
            path:'/getuserdetails/{username}',
            handler: async function (request, h) {
                var res=[];
                let command = "select * from user_details where username = $1";
                let values=[request.params.username];
                console.log(values);
                await db
                .any(command,values)
                .then(data => {
                    res = data;
                    })
                .catch(error => console.log("ERROR:", error.detail));
                    return res;
                }
        }),
        server.route({
            method : 'GET',
            path : '/getanswer/{question}',
            handler : async function (request,h){
                var res=[];
                let command = "select * from answer full join question on question.question_id=answer.question_id where question.questioner = $1 order by question.question_created";
                let values=[request.params.question];
                console.log(values);
                await db
                .any(command,values)
                .then(data => {
                    res = data;
                    })
                .catch(error => console.log("ERROR:", error.detail));
                console.log(res);
                    return res;
                }  
        }),
        server.route({
            method : 'GET',
            path : '/getanswerbytag/{tag}',
            handler : async function (request,h){
                var res=[];
                let command = "select *from question full join answer on question.question_id=answer.question_id where strpos(question.hashtags,$1) >0 or strpos(question.hashtags,$2) >0";
                let values=[request.params.tag+',',','+request.params.tag];
                console.log(values);
                await db
                .any(command,values)
                .then(data => {
                    res = data;
                    })
                .catch(error => console.log("ERROR:", error.detail));
                console.log(res);
                    return res;
                }  
        }),
    server.route({
        method: 'PUT',
        path: '/PUT',
        handler:async function (request, h) {
            const payload = request.payload;
            let promises=[];
            let result=[];
            var res=[]
            let err;
            let com = "select * from item where item_id = $1";
            let val=[payload.item_id];
            await db
            .any(com,val)
            .then(data => {
                res = data;
                })
            .catch(error => console.log("ERROR:", error.detail));
                if(res.length == 0){
                    return {
                        "Err code" : "10002",
                        "Err Msg" : "Product doesn't in the cart"
                    };
                }
            let command ="update item set price = $3 where item_id=$1";
            let values = [payload.item_id,payload.product_name,payload.price,payload.category];
            promises.push(
            db
                .one(command, values)
                .then(data => {
                    result.push(values);
                })
                .catch(error => err=error.detail)
            );
            await Promise.all(promises);
            recordActivity('PUT',payload.item_id,0,payload.price);
            console.log(payload);
            return payload;
        },
        options: {
            auth: {strategy: 'my-strategy', mode: 'required'},
            validate: {
                payload: {
                    item_id : Joi.number().required(),
                    product_name: Joi.string().min(1).max(50).required(),
                    price: Joi.number().required(),
                    category:Joi.any().valid('TV','Mobile','Pen drive','Others').required()
                }
            }
        }
    });
    server.route({
        method: 'DELETE',
        path: '/DELETE/{id}',
        handler: async function (request, h) {
            let id = request.params.id;
            var res=[];
            let err="";
            let command = "delete from item where item_id = $1";
            await db
            .any(command,id)
            .then(data => {
                res = data;
                })
            .catch(error => err=error.detail);
            if (res.length==0 && err == "")
            {
                return {
                    "Err code" : "10005",
                    "Err Msg" : "Requested item is not in the cart"
                };
            }
            recordActivity('DELETE',request.params.id,0,0);
            console.log("Deleted successfully");
            return "Deleted successfully";
        },
        options: {
            auth: {strategy: 'my-strategy', mode: 'required'},
        }
    });
    server.route({
            method: "GET",
            path: "/product-cache",
            handler: async function(req, res) {
              let payload = req.payload;
              let id= req.query["id"];
              let command = "select * from item where item_id = '" + id + "'";
              let cache = await isPresentInCache(id);
              if (!_.isEmpty(cache)) return JSON.parse(cache);
              await db
                .any(command)
                .then(async data => {
                  res = data[0];
                  await client.set("Products_" + id, JSON.stringify(res));
                })
                .catch(error => console.log("ERROR:", error));
              return res;
            },
            options: {
                auth: {strategy: 'my-strategy', mode: 'required'},
            }
        });
    await server.start();
    console.log('Server running on %s', JSON.stringify(server.info));
};
async function isPresentInCache(id) {
    try {
      let cache = await client.get("Products_" + id);
      if (!_.isEmpty(cache)) 
      {
          console.log(cache);
        return cache;
      }
      return {};
    } catch (err) {
      console.log(err);
    }
  }
  
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


init();