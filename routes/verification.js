const express = require('express')
const Router = express.Router();
Router.use(express.urlencoded())

var AWS = require("aws-sdk");

AWS.config.loadFromPath('./config/config.json');

let docClient = new AWS.DynamoDB.DocumentClient();

Router.get('/:id', function (req, res) {
    const param = req.params.id;
    const decodedValue = decodeIds(param);
    const meetingId = decodedValue.meetingId;
    const email = decodedValue.email;
    const updated = verify(email,meetingId);
    if(updated){
        res.writeHead(301,
            {Location: 'https://video.sajaldhussa.com/meeting/'+meetingId}
          );
          res.end();
    }else{
        res.sendFile('verification.html', { root: '../video-trial/public' });
    }
  })

  let verify = async function(userId, meetingId) {
      console.log(userId);
      console.log(meetingId);
    var params = {
        TableName:"users",
        Key:{
            "user_id": ""
        },
        UpdateExpression: "set verified = :r",
        ExpressionAttributeValues:{
            ":r":true,
            ":meetingId":meetingId
        },
        ConditionExpression: "meeting_id = :meetingId",
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the item...");
    let updated = false;
    await docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            updated = true;
        }
    });
    return updated;
  }

   function decodeIds(param) {
	try {
        const decoded = Buffer.from(param, 'base64').toString();

		const result = {};

		decoded.split(';').forEach(item => {
			const [key, value] = item.split('=');

			if ((key === 'email' || key === 'email') && value) {
				result.email = value;
			}

			if (key === 'meetingId') {
				result.meetingId = value;
			}
		});

		return result;
	} catch (e) {
		return undefined;
	}
}

module.exports = Router;