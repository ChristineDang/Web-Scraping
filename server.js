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

mongoose.connect("mongodb://localhost/articlesdb", {useNewUrlParser: true});
//Notification about a db connect change, but using the one taught in class because it still works:
// mongoose.connect("mongodb://localhost/articlesdb", {useUnifiedTopology: true});

app.get("/scrape", function(req,res){
    //scraping from WSJ website
    axios.get("https://www.wsj.com").then(function(response){
        var $ = cheerio.load(response.data);
        console.log(response.data);
        $("article").each(function(i, element){
            var result = {};

            result.title = $(this)
            //need to find a better way
                .children("div")
                    .children("h3")
                    .text();
            result.link = $(this)
            //need to find a better way
                .children("div")
                    .children("h3")
                        .children("a")
                        .attr("href");
            console.log("this is where the result set should be " + result);

            result.description = $(this)
                .children("p")
                .text();

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

app.get("/clear", function(req, res){
    //deleteMany() function removes all docs that match the given
    db.Article.deleteMany({}, function(err){
        console.log("clear passed")
        if(err) return handleError(err);
    });
});

app.get("/save", function(req, res){
    db.Article.insertMany({}, function(err){
        console.log("saved to mongodb")
        if(err) return handleError(err);
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