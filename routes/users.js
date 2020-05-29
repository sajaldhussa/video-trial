const express = require('express')
const Router = express.Router();
Router.use(express.urlencoded())
const EmailUtility = require('.././utility/email-utility')

var AWS = require("aws-sdk");
var uniqid = require('uniqid');

let awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "AKIAQYAJDBOKIWJQWLZX", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

Router.post('/', function (req, res) {
    let email = req.body.email;
    let user = ifUserExist(email);
    const id = null;
    if(user){
        if(user.verified){
            id = user.userId;
            res.writeHead(301,
                {Location: 'https://video.sajaldhussa.com/meeting/'+id}
              );
              res.end();
        } else{
            
        }
    }else{
         id = save(email);
    }
    res.writeHead(301,
        {Location: 'http://sajaldhussa.com/verification/'+id}
      );
      res.end();
  })

  let ifUserExist = function(email) {
    var params = {
        TableName: 'users',
        Key:{
            "userId": email
        }
    };
    let user = null;
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            user = data;
        }
    });
    return user;
  }

let save = function (email) {

    const  id = uniqid();
    var input = {
        "user_id": email, "created_on": new Date().toString(),
        "activated": false, "meeting_id": id,"verified": false
    };
    var params = {
        TableName: "users",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("users::save::success" );   
            EmailUtility.sendEmail(email);
        }
    });
    return id;  
}

module.exports = Router;