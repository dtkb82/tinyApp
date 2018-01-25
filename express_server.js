var express = require("express");
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

var PORT = process.env.PORT || 8080; // default port 8080
var randomstring = require("randomstring");


app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString(length) {
 return(randomstring.generate(length));
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/urls", (req, res) => {
  let templateVars = { 
  	urls: urlDatabase,
  	username: req.cookies["username"]
   };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
	res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
	let templateVars = { 
		shortURL: req.params.id, longURL: urlDatabase[req.params.id],
		username: req.cookies["username"]
	 };
	res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined){	
  	res.send("This URL does not exist");
  } else {
  	res.redirect(longURL);
  }
});
//takes in a long URL and redirects to a short URL
app.post("/urls", (req, res) => {
	let longURL = req.body.longURL
	let shortURL = generateRandomString(6);
	urlDatabase[shortURL] = longURL;
	
	res.redirect(`/urls/${shortURL}`);
});
//removes a URL
app.post("/urls/:id/delete", (req, res) => {
	delete urlDatabase[req.params.id]
	res.redirect('/urls');
});
//modify's existing URL's
app.post("/urls/:id/update", (req, res) => { 
	let newLongURL = req.body.id;
	let shortUrl = req.params.id;
	urlDatabase[shortUrl] = newLongURL;
	res.redirect('/urls');
});
//	
app.post("/login/", (req, res) => {
	let userName = req.body.name;
	res.cookie("username", userName);
	res.redirect('/urls');
});

app.post("/logout/", (req, res) => {
	res.clearCookie("username", req.body.userName);
	res.redirect('/urls');
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});