// Import necessary modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var createError = require('http-errors');

// Create Express app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle blog data
app.get('/', function(req, res, next) {
  // Read data from posts.json
  fs.readFile('./database/posts.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      next(createError(500)); // Internal server error
      return;
    }

    const postsData = JSON.parse(data);

    // Extract unique categories
    const categories = Array.from(new Set(postsData.map(post => post.category)));

    // Extract featured blog posts
    const featuredPosts = postsData.filter(post => post.is_featured);

    // Extract remaining blog posts
    const remainingPosts = postsData.filter(post => !post.is_featured);

    // Render the blog page with extracted data
    res.render('blog', {
      title: 'She Code Queens',
      links: ['Multiplex PCR', 'Technology', 'Design', 'Culture', 'Business', 'Sports', 'About'],
      categories: categories,
      featuredPosts: featuredPosts,
      remainingPosts: remainingPosts
    });
  });
});

// Route to handle about page
app.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Us' });
});

// Route to handle specific category pages
app.get('/multiplex-pcr', function(req, res) {
  res.render('multiplex-pcr');
});
app.get('/business', function(req, res) {
  res.render('business');
});
app.get('/sports', function(req, res) {
  res.render('sports');
});
app.get('/technology', function(req, res) {
  res.render('technology');
});
app.get('/design', function(req, res) {
  res.render('design');
});
app.get('/culture', function(req, res) {
  res.render('culture');
});
app.get('/posts/:postId', function(req, res, next) {
  const postId = req.params.postId;

  // Fetch the blog post data (replace this with your own logic to fetch data)
  const postData = {
    id: postId,
    title: "Sample Blog Post",
    content: "This is the full content of the blog post."
  };

  // Render the blog post detail page
  res.render('postDetail', { post: postData });
});



// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
