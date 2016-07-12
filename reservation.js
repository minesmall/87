var express = require('express');
var mongodb = require('mongodb');
var moment = require('moment');
var app = express();

var uri = 'mongodb://ching_1214:Sylar1214@ds047612.mongolab.com:47612/dbforitaoke';

var database;

mongodb.MongoClient.connect(uri, function(err, db) {
	if (err) {
		console.log('connect mongo db error ' + err);
	} else {
		console.log('connect mongo db success');
		database = db;
	}
});

app.get('/api/createDataPoint', function(request, response) {
	if (!request.query.value) {
		__sendErrorResponse(response, 403, 'No query parameters value');
		return;
	}

	var a;
	
	var date;
	var time;
	var two;
	var four;
	var six;
		
	var endString
	var str = request.query.value;
	var reservationArray = new Array();
	var reservationArray = str.split(",");
	
	for(a=0; a<5; a++)
	{
		if(a==0)
		{
			date = reservationArray[a];
		}
		else if (a == 1)
        {
        	time = reservationArray[a];
        }
		else if (a == 2)
        {
        	two = reservationArray[a];
        }
		else if (a == 3)
		{
			four = reservationArray[a];
		}
		else if (a == 4)
   		{
   			six = reservationArray[a];
 		}
       	
	}
	
	

	var insert = {
		date :　date,
		time : time,
		two : two,
		four : four,
		six : six,
	};

		
	var items = database.collection('dbforreservation');
	items.insert(insert, function(err, result) {
		if (err) {
			__sendErrorResponse(response, 406, err);
		} else {
			response.type('application/json');
			response.status(200).send(result);
			response.end();
		}
	});
});

app.get('/api/querySeatData', function(request, response) {
	var items = database.collection('dbforreservation');

	var limit = parseInt(request.query.limit, 10) || 100;

	items.find().sort({$natural: -1}).limit(limit).toArray(function (err, docs) {
		if (err) {
			console.log(err);
			__sendErrorResponse(response, 406, err);
		} else {
			var jsArray = new Array();
            var jsArray = docs;
            var seatCount;
            for(var i = 0; i < jsArray.length; i++){
                var jsObj = Object();
                var jsObj = jsArray[i];
                seatCount = jsObj.seat;
            }
			response.type('application/json');
			response.status(200).send(seatCount);
			response.end();
		}
	});
});

app.get('/api/updateSeatData', function(request, response) {
	var items = database.collection('dbforreservation');
	var limit = parseInt(request.query.limit, 10) || 100;

	var str = request.query.value;

	items.update( { title:"CountSeat" }, { '$set': { seat:str } });
	response.type('application/json');
	response.status(200).send("succeed");
	response.end();
});



app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.listen(process.env.PORT || 6666);
console.log('port ' + (process.env.PORT || 6666));

function __sendErrorResponse(response, code, content) {
	var ret = {
		err: code,
		desc : content 
	};
	response.status(code).send(ret);
	response.end();
}