// Remove two lines below for deploying to heroku
var host = "127.0.0.1";
var port = 9002;

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
// Remove three lines below for deploying to heroku
app.use('/', express.static(__dirname + '/'));
console.log('Running server at http://localhost:' + port + '/');
// var request = require('request');
var soap = require('soap');
var parseString = require('xml2js').parseString;

var crifCred = require('./credentials/crif_credentials.json');

var url = 'http://webservices.eurotaxglass.com/wsdl/identification-v2.wsdl'; // Our WSDL
var OrderRequestElement =   {
	"test": "test",
}

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/search"
 *    GET: test search query
 *    POST: creates a new motor record
 */

app.get("/soap", function(req, res) {
	console.log("SOAP request");
	soap.createClient(url, function(err, client){
		var soapHeader = {
  			"ETGHeader": {
  				"VersionRequest" : crifCred.versionRequest,
  				"Originator": {
  					"Signature" : crifCred.signature,
  					"LoginData" : {
	  					"Name": crifCred.name,
	  					"Password" : crifCred.password,
	  					"ReturnSecurityToken" : crifCred.returnSecurityToken
	  				},
  					"SecurityToken" : crifCred.securityToken
  				}
  			}
		};
		client.addSoapHeader(soapHeader);
		// The Client now has all the methods of the WSDL. Use it to create a new order by feeding it the JSON Payload
		client.GetListMake(OrderRequestElement, function(err, result, body) {
			parseString(body, function(err, result){
				// Get The Result From The Soap API and Parse it to JSON
				if (err){
					return res.status(500).json(err);
				}
				return res.json(result); 
			})
		});
	});
	// res.send("OK");
});

app.get("/search", function(req, res) {
    var registrationId = req.query.reg;
	if(registrationId == 1) {
		var make = "Bentley";
		var model = "Continental GT3-R";
	} else {
		var make = "Porsche";
		var model = "911";
	}

	res.json({
		"registrationId": registrationId,
	  	"data": {
	    	"make": make,
	    	"model": model
	  	},
	  	"status": 200,
	  	"message": "OK"
	});
});

app.post("/search", function(req, res) {
});

/*  "/contacts/:id"
 *    GET: find motor by id
 *    PUT: update motor by id
 *    DELETE: deletes motor by id
 */

app.get("/search/:id", function(req, res) {
});

app.put("/search/:id", function(req, res) {
});

app.delete("/search/:id", function(req, res) {
});

// GENERAL COMMENTS
// 1 line below for localhost, 2 lines below for heroku.
app.listen(port, host);
// app.listen(process.env.PORT || 80);