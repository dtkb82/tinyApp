var express = require("express");
var app = express();
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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
	res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
	let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
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
	var shortURL = generateRandomString(6);
	urlDatabase[shortURL] = longURL;
	
	res.redirect(`/urls/${shortURL}`);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});