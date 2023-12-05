const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');


const app = express();

const dbURI = 'mongodb+srv://testuser:test123@cluster1.9stefql.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });

// //mongoose and mongo routes
// app.get('/add-blog', (req, res) => { 
//     const blog = new Blog({ 
//         title: 'new blog 2', 
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     }); 
//     blog.save() // saves the blog document to the database
//         .then((result) => { 
//             res.send(result) 
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })
// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result); 
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })
// app.get('/single-blog', (req,res) => {
//     Blog.findById('656d5c0c6cea8d5f2f74fa3b')
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })
app.get('/', (req, res) => {
    res.redirect('/blogs'); 
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new Blog' });
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1})
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log(err);
      })
  });
  
  app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id; 
    
    Blog.findByIdAndDelete(id) 
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      })
  });

app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
});