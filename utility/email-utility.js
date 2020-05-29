var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1', accessKeyId: "AKIAQYAJDBOKEATULTWC", secretAccessKey: "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"});


// Create sendEmail params 
var sendEmail = function(email, meetingId) {
var params = {
  Destination: { /* required */
    ToAddresses: [
        email
    ]
  },
  Message: { 
    Body: {
      Html: {
       Charset: "UTF-8",
       Data: "Please click <a href='http://sajaldhussa.com/verification/"+ meetingId +"'>Here</a> to verify."
      },
      Text: {
       Charset: "UTF-8",
       Data: "TEXT_FORMAT_BODY"
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'Verification Email'
     }
    },
  Source: 'verification@sajaldhussa.com',
  ReplyToAddresses: [
     'verification@sajaldhussa.com',
    /* more items */
  ],
};

// Create the promise and SES service object
var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
}
module.exports = {
    sendEmail
};