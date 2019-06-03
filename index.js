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
        method : 'POST',
        path: '/addAnswer',
        handler : async function(req,h){
            const payload=req.payload;
            var res=[];
            let command='insert into answer(author,question_id,answer) values($1,$2,$3)';
            let values=[payload.author,payload.question_id,payload.answer]
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
        method : 'POST',
        path :'/addFav/{name}/{id}',
        handler: async function (req, h) {
            var res=[]
            let command = "select favorites from user_actions where username = $1";
            let values=[req.params.name];
            await db
            .any(command,values)
            .then(data => {
                res = data;
                })
            .catch(error => console.log("ERROR:", error.detail));
            res[0].favorites+=' '+req.params.id+' ';
            let c="update user_actions set favorites=$1 where username=$2";
            let v=[res[0].favorites,req.params.name];
            console.log(v)
            db
            .any(c,v)
            .then(data =>{
                console.log(data);
                return data;
            })
            .catch(error =>{
                console.log('failure');
                return error;
            })
            return res;
        }
    }),
    server.route({
        method : 'POST',
        path :'/addRead/{name}/{id}',
        handler: async function (req, h) {
            var res=[]
            let command = "select read_later from user_actions where username = $1";
            let values=[req.params.name];
            await db
            .any(command,values)
            .then(data => {
                res = data;
                })
            .catch(error => console.log("ERROR:", error.detail));
            res[0].read_later+=' '+req.params.id+' ';
            let c="update user_actions set read_later=$1 where username=$2";
            let v=[res[0].read_later,req.params.name];
            console.log(v)
            db
            .any(c,v)
            .then(data =>{
                console.log(data);
                return data;
            })
            .catch(error =>{
                console.log('failure');
                return error;
            })
            return res;
        }
    }),
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
                let command = "select *,question.question_id from question full join answer on question.question_id=answer.question_id where strpos(question.hashtags,$1) >0 or strpos(question.hashtags,$2) >0";
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
            method : 'POST',
            path : '/addcredit/{id}/{credit}',
            handler : async function (request,h){
                var res=[];
                let command="update user_actions set credits=credits+$2 where username=$1";
                let values=[request.params.id,request.params.credit];
                await db
                .any(command,values)
                .then(data =>{
                    res=data;
                })
                .catch(error=>console.log('Error'+error));
                return res;
            }
        }),
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