// Ensure that the route for handling categories is defined before any catch-all routes
app.use('/categories', categoryRouter);

// Ensure that the route for handling category requests is defined correctly
app.get('/categories/:category', function(req, res, next) {
  // Retrieve the category from the request parameters
  const category = req.params.category;

  console.log('Requested category:', category); // Log the requested category

  // Implement logic to handle category requests

  // Render the categories page with the retrieved blog posts
  res.render('categories', { title: 'Categories', category: category });
});
