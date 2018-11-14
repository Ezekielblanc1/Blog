const express = require('express'),  app= express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override');




//Connect mongoose 

mongoose.connect('mongodb://localhost:27017/restful_blog_app', {useNewUrlParser: true})
.then(() => console.log('Connected to database'))
.catch(err => console.error('Could not connect to database'));

app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))

//Set up Schema And Model Config

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  createdAt: {type: Date, default: Date.now}
})

const Blog = mongoose.model('Blog', blogSchema)

// Routes
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err){
      console.log(err)
    } else {
      res.render("index", {blogs: blogs})
    }
  })
  
})

//New Route to show form Data
app.get('/blogs/new', (req,res) => {
  res.render("new")
})
//Create Route

app.post('/blogs', (req, res) => {
  Blog.create(req.body.blog, (err, newBlog)=>{
    if (err) {
      res.render("new")
    } else{
      res.redirect("/blogs")
    }
  })
})

//Show Route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, found) => {
    if(err){
      res.redirect('/blogs')
    } else {
      res.render("show", {blog: found})
    }
  })
})

//EDIT Route

app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, found) => {
    if(err){
      res.redirect('/blogs')
    } else {
      res.render("edit", {blog: found})
    }
  })
})


app.put('/blogs/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, foundBlog) => {
    if(err){
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs/' + req.params.id)
    }
  })
})

app.delete('/blogs/:id',(req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect('/blogs')
    }else{
      res.redirect('/blogs')
    }
  })
})




app.listen(5000, ()=> console.log("Connected Successfully"))

