var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const db = require('../database-postgresql/index');

// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
// var items = require('../database-mongo');

// Connect to DATABASE
db.connect();


//*********************************************************************************************************
//DATABASE HELPER FUNCTIONS NEEDED: 
// searchTerm(string, callback) - Gets all recipies from db that include string in its name then uses cb to return them.  
// addToDb(obj, callback) - Adds obj to db then invokes cb. 
// getAll(callback) - Gets all recipes from database and uses cb to return them
// getUserFavorites(userId, callback) - Users userId to find users saved recipes then returns them using cb.
//*********************************************************************************************************

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json())



app.post('/search', (req, res) => {
// 	/search - Query DB for recipes by search term	
  db.searchTerm(req.body.search, (data) => {
  	res.status(201);
  	res.send(data);
  })
})
	
app.get('/search/filter', (req, res) => {
// /search/filter - GET request to API (ingredients, ??)
// fill out options with correct api info 
  var options = {
  }
  //call api
	request(options, (error, response, body) => {
		if(error){
			console.log(error)
			res.send(error)
		} else {
			//add api info to db then send back to client 
			db.addToDb(body, (data)=> {
				res.status(200);
				res.send(body)
			})
		}
	})
})

app.get('/grid', (req,res) => {
// 	/grid - Query DB for all recipes (12?)
	db.getAll(data => {
		res.status(200);
		res.send(data);
	})
})

app.get('/favorites', (req,res) => {
// 	/favorites - Query DB for user’s favorites
	//either use url to find specific user, or send user info in header, or convert to 
	//post and send user name in body 
	db.getUserFavorites(userId, (data)=> {
		res.status(200);
		res.send(data)
	})
})

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

	
	



	




