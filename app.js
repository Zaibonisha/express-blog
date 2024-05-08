var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route to handle blog data
app.get('/', function(req, res, next) {
  // read data from posts.json
  fs.readFile('./database/posts.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      next(createError(500)); // Internal server error
      return;
    }

    const postsData = JSON.parse(data);

    // extract unique categories
    const categories = Array.from(new Set(postsData.map(post => post.category)));

    // extract featured blog posts
    const featuredPosts = postsData.filter(post => post.is_featured);

    // extract remaining blog posts
    const remainingPosts = postsData.filter(post => !post.is_featured);

    // render the blog page with extracted data
    res.render('blog', {
      title: 'She Code Queens',
      links: ['Multiplex PCR', 'Technology', 'Design', 'Culture', 'Business', 'Sports'],
      categories: categories,
      featuredPosts: featuredPosts,
      remainingPosts: remainingPosts
    });
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
