var express         = require("express"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    bodyParser      = require("body-parser"), 
    mongoose        = require("mongoose"),
    app             = express();


mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


// Blog.create({
//     title: "test blog",
//     image: "https://img.yle.fi/uutiset/kotimaa/article11197091.ece/ALTERNATES/w960/T%C3%B6yht%C3%B6tiainen,%20C%20Hannu%20Siitonen.jpg",
//     body: "This is a test blog"
// });
//Restful routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
})

// Index route
app.get("/blogs", function(req, res) {

    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log("Error!");
        } else {
            res.render("index", {blogs: blogs});

        }
    });


})

// new route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//create route
app.post("/blogs", function(req, res) {

    console.log(req.body)
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("=================")
    console.log(req.body)
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })

});

//show route
app.get("/blogs/:id", function(req, res) {

    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: foundBlog})
        }
    })
});

//Edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});

        }
    });

});

//Update route
app.put("/blogs/:id", function(req, res) {
    console.log(req.body)
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("=================")
    console.log(req.body)

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if(err) {
            res.redirect("/blogs")


        } else {
            res.redirect("/blogs/" + req.params.id);



        }

    });

});

//Delete route
app.delete("/blogs/:id", function(req, res) {

    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log("there is an error")

            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
            console.log("there is no error")

        }
        
    });


});





app.listen(3000, function() {
    console.log("server listening")
})
