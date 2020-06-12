var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsScraper", {useNewUrlParser: true});

app.get("/scrape", function(req,res){
    //scraping from WSJ website
    axios.get("https://www.wsj.com").then(function(response){
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element){
            var result = {};

            result.title = $(this)
            //add in stuff
                .children("")
                .text();
            result.link = $(this)
            //fix the add in stuff
                .children("a")
                .attr("href");
            
            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(err){
                    console.log(err);
                });
        });
        res.send("Scraping Complete");
    });
});

app.get("/articles", function(req, res){
    //name of db
    db.Article.find({})
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res){
    //name of db
    db.Article.findOne ({_id: req.params.id})
        .populate("note")
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res){
    //name of collection
    db.Note.create(req.body)
        //calling upon the db collection
        .then(function(dbNote){
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note:dbNote._id}, {new: true});
        })
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT);
});