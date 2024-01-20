const express = require('express');
// Controller
const shopController = require('../controllers/Shop.controller');

// Express Router
const router = express.Router();

// Routes
router.get('/', shopController.shop_index);
router.get('/products/:category', shopController.shop_get_filtered_products);
router.get('/product/:id', shopController.shop_get_product);

module.exports = router;