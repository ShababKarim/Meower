const express = require('express');
const cors = require("cors");
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const app = express();
const db = monk(process.env.MONGO_URI || 'localhost/meower'); //connect to mongodb on local machine to a db called meower

let mews = db.get('mews'); //getting from db collection "mews"
let filter = new Filter(); 

app.use(cors()); //any incoming req passes through this express middleware
app.use(express.json()); //any incoming req w/ content type of "application/json" is parsed else it would display as undefined


app.get("/", function(req, res){
    res.json({
        message: "Hey cutie"
    });
});

app.get("/mews", function(req, res){
    mews
        .find()
        .then(mews => {
            res.json(mews); //the mews you get back from "find", not the collection "mews"
        });
});

function isValidMew(mew){
    return mew.name && mew.name.toString().trim() != '' &&
        mew.content && mew.content.toString().trim() != '';
}//making sure input isn't empty (study this)

app.use(rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1 // limit each IP to 100 requests per windowMs
}));

app.post("/mews", function(req, res){
    if(isValidMew(req.body)){
        //insert into db
        let mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        }
        mews
            .insert(mew)
            .then(function(createdMew){
                res.json(createdMew);
            });
    }else{
        res.status(422);//semantic error
        res.json({
            message: "Name and content are required"
        });
    }
});

app.listen(5000, function(){
    console.log("Listening on http://localhost:5000");
});
//cool trick, if you go into package.json
//change the error in script to "start" and the value to "node index.js"
//will run automatically when you do "npm start"

//npm i --save-dev nodemon 
//anytime files saved, server refreshes
//also add script: "dev": "nodemon index.js"
//server started once in terminal "npm run dev"