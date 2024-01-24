const express = require('express');
const upload = require('../middleware/Multer.middleware');
// Controller
const dashboardController = require('../controllers/Dashboard.controller');

// Express Router
const router = express.Router();

// Routes
router.get('/', dashboardController.dashboard_index);
router.get('/manage-products/products', dashboardController.dashboard_get_products);
router.get('/manage-products/products/:category', dashboardController.dashboard_get_filtered_products);
router.post('/manage-products', upload.array('product_images', 4), dashboardController.dashboard_create_product);
router.delete('/manage-products/products/:id', dashboardController.dashboard_delete_product);
router.post('/orders', dashboardController.dashboard_create_order);

module.exports = router;