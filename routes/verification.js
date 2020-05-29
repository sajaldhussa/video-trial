const express = require('express')
const Router = express.Router();
Router.use(express.urlencoded())

var AWS = require("aws-sdk");

let awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "AKIAQYAJDBOKIWJQWLZX", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

Router.get('/:id', function (req, res) {
    const meetingId = req.params.id;
    const updated = verify(meetingId);
    if(updated){
        res.writeHead(301,
            {Location: 'https://video.sajaldhussa.com/meeting/'+meetingId}
          );
          res.end();
    }else{
        res.sendFile('verification.html', { root: '../public' });
    }
  })

  let verify = function(meetingId) {
    var params = {
        TableName:users,
        Key:{
            "meeting_id": meetingId
        },
        UpdateExpression: "set info.verified = :r",
        ExpressionAttributeValues:{
            ":r":true
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the item...");
    let updated = false;
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            updated = true;
        }
    });
    return updated;
  }

module.exports = Router;