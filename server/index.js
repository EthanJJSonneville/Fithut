const express = require("express");
//Allows express to read the body and then parse that into a Json object that we can understand 
const bodyParser = require("body-parser");
//a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain 
//from which the first resource was served.
const cors = require("cors");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());
//Brings posts.js here to use

const calendar = require(`./routes/api/calendar`);
const formSubmisson = require(`./routes/api/formSubmission`);
const homepage = require(`./routes/api/homepage`);

//app uses posts, puts it on the route /api/posts

app.use('/api/calendar',calendar);
app.use('/api/FormSubmission', formSubmisson);
app.use('/api/homepage',homepage);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));