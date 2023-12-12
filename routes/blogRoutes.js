const express = require('express');
const blogController = require('../controllers/blogController');
const router = express.Router();


router.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new Blog' });
});

router.get('/', blogController.blog_index);

router.post('/', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get('/:id', blogController.blog_details);

  router.delete('/:id', (req, res) => {
    const id = req.params.id; 

    Blog.findByIdAndDelete(id) 
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      })
  });
module.export = router;