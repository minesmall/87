var express = require('express');
var mongodb = require('mongodb');
var moment = require('moment');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var app = express();
var email ;
var password;
var username;
var PhoneNumber;
var birth;
var uri = 'mongodb://minesmall:earik2@ds013584.mlab.com:13584/gonow';
var database;


var transporter = nodemailer.createTransport({
        service: 'Gmail',
    auth: {
        user: 'a7474310@gmail.com',
        pass: 'earik2123'
    }
});
mongodb.MongoClient.connect(uri, function(err, db){
	if(err){
		console.log('connect mongo db error' + err);
	}else{
		console.log('connect mongo db success');
		database = db;
	}
});
app.get('/api/createDataPoint',function(request,response){
	email = request.query.email;
	password = request.query.password;
	username = request.query.username;
	PhoneNumber = request.query.PhoneNumber;
	birth = request.query.birth;

	var items = database.collection('login');
	var randomstring = crypto.randomBytes(32).toString('base64').substr(0, 8);
	items.find({email:request.query.email}).toArray(function(err,docs){
		if (err) {
			response.type('此信箱已被使用');
			response.status(406).send(err);
		} else {
			var options = {
				from: 'a7474310@gmail.com',
 				to: request.query.email,
 				subject: '一起趣玩-共遊跟車系統認證信',
 				text: '親愛的用戶您好:歡迎您成為一起趣玩-共遊跟車系統的會員！\n請輸入以下驗證碼:'+ randomstring
 			};
			transporter.sendmail(options,function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			        console.log('訊息發送: ' + info.response);
			    }
			});
			//response.type('application/json');
			//response.status(200).send('code:'+randomstring).end();
			response.write(randomstring);
			response.end();
		}
	});
});
app.get('/api/insertMdata',function(request,response){
	var items = database.collection('login');
	var insert = {
		email ,
		password,
		username,
		PhoneNumber,
		birth
	}
	var code = 0;
	code = request.query.code;
	if(code == 1){
		items.insert(insert,function(err,result){
			if (err) {
				response.status(406).send(err);
			} else {
				response.type('application/json');
				response.status(200).send(result).end();
				email='' ;
				password='';
				username='';
				PhoneNumber='';
				birth='';
			}
		});	
	} else{
		console.log(error);
	}
});

app.get('/api/queryDataPoint',function(request,response){
	var items = database.collection('login');
items.find().sort({$natural:-1}).toArray(function(err,docs){
	if (err) {
			console.log(err);
			response.status(406).send(err);
		} else {
			response.type('application/json');
			response.status(200).send(docs);
			response.end();

		}
	});
});
	app.use(express.static(__dirname+'/public'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.listen(process.env.PORT || 5000);
console.log('port ' + (process.env.PORT || 5000));
