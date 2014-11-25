/*
 * Copyright 2014 IBM Corp. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 /* MQ specific*/
 
var PUBLISH_TOPIC = "mqlight/sample/words";	
var SUBSCRIBE_TOPIC = "mqlight/sample/wordsuppercase";
var SHARE_ID = "node-front-end";
var mqlightServiceName = "mqlight";

var http = require('http');
var fs = require('fs');
var express = require('express');
var mqlight = require('mqlight');
var bodyParser = require('body-parser');

/*
 * Establish MQ credentials
 */
var opts = {};
var mqlightService = {};
if (process.env.VCAP_SERVICES) {
	var services = JSON.parse(process.env.VCAP_SERVICES);
	console.log( 'Running BlueMix');
	if (services[ mqlightServiceName ] == null) {
		throw 'Error - Check that app is bound to service';
	}
	mqlightService = services[mqlightServiceName][0];
	opts.service = mqlightService.credentials.connectionLookupURI;
	opts.user = mqlightService.credentials.username;
	opts.password = mqlightService.credentials.password;
} else {
	opts.service = 'amqp://localhost:5672';
}

/*
 * Establish HTTP credentials, then configure Express
 */
var httpOpts = {};
httpOpts.port = (process.env.VCAP_APP_PORT || 3000);

var app = express();
/*
 * Create our MQ Light client
 * If we are not running in Bluemix, then default to a local MQ Light connection  
 */
var mqlightSubInitialised = false;
var mqlightClient = mqlight.createClient(opts, function(err) {
	if (err) {
		console.error('Connection to ' + opts.service + ' using client-id ' + mqlightClient.id + ' failed: ' + err);
	} else {
		console.log('Connected to ' + opts.service + ' using client-id ' + mqlightClient.id);
	}
	/*
	 * Create our subscription
	 */
	mqlightClient.on('message', processMessage);
	mqlightClient.subscribe(PUBLISH_TOPIC, SHARE_ID, 
		{credit : 1024,
			autoConfirm : true,
			qos : 1}, function(err) {
				if (err) console.err("Failed to subscribe: " + err); 
				else {
					console.log("Subscribed");
					mqlightSubInitialised = true;
				}
			});
});

/*
 * Store a maximum of one message from the MQ Light server, for the browser to poll. 
 * The polling GET REST handler does the confirm
 */
 /*
 * Use JSON for our REST payloads
 */
app.use(bodyParser.json());

var heldMsg;
function processMessage(data, delivery) {
	try {
		console.log("Received data: ");
		//data = JSON.parse(data);
		heldMsg = objToString(data);		
		console.log("Get the message back from MQLIGHT" + heldMsg);	
		PushMessageToDevice(heldMsg);
		//console.log("Received response: " + JSON.stringify(data));
	} catch (e) {
		console.log("In processMessage json Exception: ");
	}
	//heldMsg = {"data" : data, "delivery" : delivery};
}

function objToString(object) {
	try{
		return object.toString();
	} catch(e) {
		return "No message";
	}
    /*var type = typeof object 
    if (type == "object") {
        for (var key in object) {
            objToString(object[key], heldMsg);
        }
    } else {
			heldMsg = heldMsg + object.toString();
         }*/
 }

/*
 * POST handler to publish words to our topic
 */
function SendToMQLight(message) {
	// Check we've initialised our subscription
	if (!mqlightSubInitialised) {
		return "Failed 3";
	}
	try {
	var msgData = {"message" : "Test" + message,"frontend" : mqlightClient.id};
	console.log("Sending message: " + JSON.stringify(msgData));
	mqlightClient.send(PUBLISH_TOPIC, msgData);
	console.log("Message pushed to topic");
	} catch (e) {
		return "Failed 3";
	}
	return "Success 3";
}

/****************************************MQ specific**********************************************/
 
//var express = require('express');
//var bodyParser = require('body-parser');
var ibmbluemix = require('ibmbluemix');
var ibmpush = require('ibmpush');
var ibmcloudcode = require('ibmcloudcode');
//configuration for application

var appConfig = {
    applicationId: "",
    applicationRoute: "",
	applicationSecret: ""
};
// create an express app
//var app = express();
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//uncomment below code to protect endpoints created afterwards by MAS
//var mas = require('ibmsecurity')();
//app.use(mas);


//initialize mbaas-config module
ibmbluemix.initialize(appConfig);
 
var logger = ibmbluemix.getLogger();

app.use(function(req, res, next) {
	req.ibmpush = ibmpush.initializeService(req);
	req.logger = logger;
	next();
});

//initialize ibmconfig module
var ibmconfig = ibmbluemix.getConfig();

//get context root to deploy your application
//the context root is '${appHostName}/v1/apps/${applicationId}'
var contextRoot = ibmconfig.getContextRoot();
appContext=express.Router();
app.use(contextRoot, appContext);

console.log("contextRoot: " + contextRoot);
var savedReq;
// log all requests
app.all('*', function(req, res, next) {
	console.log("Received request to BIP" + req.url);
	savedReq = req;
	next();
});

// create resource URIs
// endpoint: https://mobile.ng.bluemix.net/${appHostName}/v1/apps/${applicationId}/notifyOtherDevices/

appContext.post('/notifyOtherDevices', function(req,res) {
//savedReq = req;
	var mqPush = SendToMQLight("This is a test message");
	var msgtext = "The BlueList has been updated. " + mqPush;
	console.log("Trying to send push notification via JavaScript Push SDK");
	var message = { "alert" : msgtext,
					"url": "http://www.google.com"
	};

	req.ibmpush.sendBroadcastNotification(message,null).then(function (response) {
		console.log("Notification sent successfully to all devices.", response);
		res.send("Sent notification to all registered devices.");
	}, function(err) {
		console.log("Failed to send notification to all devices.");
		console.log(err);
		res.send(400, {reason: "An error occurred while sending the Push notification.", error: err});
	});
});

//Custom code
function PushMessageToDevice(message1) {
	console.log("Sending message after listening from MQLIGHT test" + message1);
	var message = { "alert" : message1,
					"url": "http://www.google.com"
	};

	savedReq.ibmpush.sendBroadcastNotification(message,null).then(function (response) {
		console.log("Notification sent successfully after listening.", response);
	}, function(err) {
		console.log("Failed to send notification after listening.");
		console.log(err);
	});
}
//Custom Code

// host static files in public folder
// endpoint:  https://mobile.ng.bluemix.net/${appHostName}/v1/apps/${applicationId}/static/
appContext.use('/static', express.static('public'));

//redirect to cloudcode doc page when accessing the root context
app.get('/', function(req, res){
	res.sendfile('public/index.html');
});

app.listen(ibmconfig.getPort());
console.log('Server started at port: '+ibmconfig.getPort());
