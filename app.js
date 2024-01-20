// Import required modules
const express = require('express');
const cors = require('cors');
// Import DB
const db = require("./models");

//-------------- Routes --------------
const shopRoutes = require('./app/routes/Shop.routes');
const dashboardRoutes = require('./app/routes/Dashboard.routes');

// Create an Express application
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors());
app.use(express.static('public'));

// Routes
//shop routes
app.use('/shop', shopRoutes);
//dashboard routes
app.use('/dashboard', dashboardRoutes);

// Start the server
db.sequelize.sync().then((req) => {
  app.listen(3000, () => {
    console.log(`Server is running`);
  });
});