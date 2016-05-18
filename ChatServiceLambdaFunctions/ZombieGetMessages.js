console.log('Loading function');
var aws = require('aws-sdk');
var ddb;

var theContext;

function dynamoCallback(err, response) {
    if (err) {
        console.log('error' + err, err.stack); // an error occurred
        theContext.fail(err);
    }

    else {
        console.log('result: ' + JSON.stringify(response))        // successful response
        theContext.succeed(response);
    }
}

function init(context) {
  if(!ddb) {
    var stackName = context.functionName.split('-')[0];
    ddb = new aws.DynamoDB({
      region: "us-west-2",
      params: { TableName: stackName + "-messages" }
    });
  }
}

exports.handler = function(event, context) {
    init(context);
    theContext = context;
    var params = {
        "KeyConditions": {
            "channel": {
                "AttributeValueList": [{
                    "S": "default"
                }],
                "ComparisonOperator": "EQ"
            }
        },
        "Limit": 20,
            "ScanIndexForward":false
    }
    console.log("Querying DynamoDB");
    var response = ddb.query(params, dynamoCallback);
}
