var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var url = 'mongodb://localhost:27017/ydiskolaveri';
app.get('/register',function(req,res){
	res.sendFile(__dirname+"/register.html");
	//res.render('/register')
});

app.get('/login',function(req,res){
	res.sendFile(__dirname+"/login.html");
	//res.render('/register')
});

app.post('/login',function(req,res){
	var login = {username:req.body.username,
		password : req.body.password
	};
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log("Error in establishing connection");
			res.send("Error in establishing connection");
		}
		else{
			db.collection('users').count(login,function(err,count){
				if (count != 0){
					res.send("this is home page");
				} else {
					res.send("Username and password is wrong")
				}
			});
				
		}
	});
});
app.post('/register',function(req,res){
	var newUser = {
	username: req.body.username,
	password: req.body.password,
	email: req.body.email
	};
	mongoClient.connect(url,function(err,db){
		if (err){
			 console.error('Error occured in database');
			 res.send("Error in connection");
			
		} else{
			console.log('Connection established '+ url);
			db.collection('users').count({email:newUser.email},function(err,count){
			if (err){console.log(err);}
			else{ 
					var number = count;
					if (count ==0){
					db.collection('users').insert(newUser,function(err,result){
					if (err){
						console.log(err);
					} else {
						
					
						console.log('Item Inserted');
						res.sendFile(__dirname+'/login.html')
						
						db.close();
					}
					});
					
					} else {
						res.send("already exists");
						db.close();

					}
				}
			
		
			});
			
		}
	});
	
	
});

app.get('/forgotpassword',function(req,res){
	res.sendFile(__dirname+'/forgotpassword.html');
});

app.post('/forgotpassword',function(req,res){
	console.log("Entered the post method");
	var resultArray = [];
	var forgotMail = { "email": req.body.forgotmail};
	
	mongoClient.connect(url,function(err,db){
		if (err){
			console.log('Error occured');
		} else {
			console.log('Connection established'+db);
			cursor = db.collection('users').find(forgotMail);
			cursor.forEach(function(doc,err){
				if (err){
					console.log(err);
				} else {
					console.log("super");
					resultArray.push(doc);
					
				}
			},function(){
				//var contents = fs.readFileSync(resultArray[0]);
				//var jsonContent = JSON.parse(contents);
				res.send(resultArray);
				//res.send("Recieved data");
				db.close();
			});
			
			
		
		}
	});
});

app.listen(3000);
console.log('Running on port 3000');

http.createServer(function(request ,response){
	response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Page One');
}).listen(80);
console.log("Server is listening");