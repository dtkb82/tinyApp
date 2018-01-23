var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var randomstring = require("randomstring");
// var generateRandomString = randomstring.generate(6);

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString(length) {
 return(randomstring.generate(length));
}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
	res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
	let templateVars = { shortURL: req.params.id };
	res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
	console.log(req.body, generateRandomString(6)); //debug statement to see POST parameters
	res.send("Ok");
});

// app.get("/hello", (req, res) => {
// 	res.end("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});