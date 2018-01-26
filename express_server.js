const express = require("express");
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const app = express();

app.use(cookieSession({
	name: 'session',
	keys: ["my secret key"],
}))

// app.use(cookieParser());

// Middleware to see what's going on with the server
app.use(morgan('dev'))


var PORT = process.env.PORT || 8080; // default port 8080
var randomstring = require("randomstring");


app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString(length) {
 return(randomstring.generate(length));
}

const urlDatabase = { 
  "b2xVn2": {
    longURL: "userRandomID", 
    shortURL: "user@example.com", 
    userID: "purple-monkey-dinosaur"
  },
 "9sm5xK": {
    longURL: "user2RandomID", 
    shortURL: "user2@example.com", 
    userID: "dishwasher-funk"
  }
}

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
  ,
 "12345": {
    id: "12345", 
    email: "Ken@hotmail.com", 
    password: "111"
  }
  
}

function fetchUserName(){
	return req.session["user_id"] ? users[req.session["user_id"]].username : ""
}

// function checkUser(req, res, next) {
// 	if (req.path.match(/login|registration/)) {
// 		next()
// 		return
// 	}
// }
function getUser(req){
	if(users[req.session ["user_id"]] != null){
		return users[req.session["user_id"]];
	} else {
		return false;
	}
}

function urlsForUser(userID){
	 var userUrlDB = {};	
	  for(var key in urlDatabase){
	  	if(urlDatabase[key].userID == userID){
	  		userUrlDB[key] = urlDatabase[key];
		}
	  }
	  
	  	return userUrlDB;
} 

app.get("/urls", (req, res) => {
	var userID = req.session["user_id"];

	if (getUser(req) == false ){
		res.redirect('/login');
	} else {

	  let templateVars = { 
	  	urls: urlsForUser(userID),
	  	user: users[userID]	
	   };

	  res.render("urls_index", templateVars);
	}
});

app.get("/urls/new", (req, res) => {
	if (getUser(req) != false ){
		res.render("urls_new", {user:getUser(req)});
	} else {
		res.redirect('/login');
	}	
});

app.get("/urls/:id", (req, res) => {
	let templateVars = { 
		shortURL: req.params.id, 
		longURL: urlDatabase[req.params.id].longURL,
		user: users[req.session["user_id"]]
	 };
	 console.log([req.session["user_id"]]);
	res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
	//console.log(req.params.shortURL)
	// console.log(urlDatabase)
  	if (urlDatabase[req.params.shortURL] != null){
	  	let longURL = urlDatabase[req.params.shortURL].longURL;
	  	res.redirect(longURL);
	} else {
		res.send("short URL does not exist");
	}
});

//takes in a long URL and redirects to a short URL
app.post("/urls", (req, res) => {
	let longURL = req.body.longURL
	let shortURL = generateRandomString(6);
	urlDatabase[shortURL] = {
		longURL: longURL, 
    	shortURL: shortURL, 
    	userID: req.session["user_id"]
	};
	
	res.redirect(`/urls/${shortURL}`);
});

app.get("/registration", (req, res) => {
	res.render("urls_registration");	
});

app.post("/registration", (req, res) => {
	console.log(req.body)
	bcrypt.hash(req.body.password, 10, (err, hash) => {
		if (err) {
			res.send("There was an error creating your account.")
			return
		} 

	let randomId = generateRandomString(6);
	users[randomId] = {id: randomId, email: req.body.email, password: hash};
		console.log(users);
	req.session.user_id = randomId;
	// res.cookie("user_id", cookie);
	res.redirect('/urls');
	});
//res.cookie
});

//removes a URL
app.post("/urls/:id/delete", (req, res) => {
	if (urlDatabase[req.params.id].userID == req.session["user_id"]){
		delete urlDatabase[req.params.id]
		res.redirect('/urls');
	} else {
		res.status(403);
		res.send("not the right user")
	}	
});
//modify's existing URL's
app.post("/urls/:id/update", (req, res) => { 
	let newLongURL = req.body.longURL;
	let shortUrl = req.params.id;
	if (urlDatabase[req.params.id].userID == req.session["user_id"]){
		 urlDatabase[req.params.id].longURL = newLongURL;
		res.redirect('/urls');
	} else {
		res.status(403);
		res.send("not the right user")
	}
});
//	
app.get("/login", (req, res) => {
	res.render("urls_login");	
});

app.post("/login/", (req, res) => {
	const email = req.body.email
	const password = req.body.password


	for (key in users){
		if (users[key].email === email && bcrypt.compareSync(password, users[key].password)){
			res.cookie("user_id", users[key].id);
			res.redirect('/urls');
			return
		} 
	}
		res.status(403);
		res.send("please enter a valid email and password")
});

app.post("/logout/", (req, res) => {
	req.session = null;
	res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




