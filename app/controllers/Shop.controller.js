const db = require("../../models");
//----------------------  Models -------------------------
const Product = db.products;
const ProductImage = db.product_images;

//----------------------  Functions -------------------------
const shop_index = async (req, res) => {
    try {
        // Get All Products from the DB
        const products = await Product.findAll();

        res.json(products);

    } catch(err) {
        console.log(err);
    }
}

const shop_get_filtered_products = async (req, res) => {
    try {
        const productCategory = req.params.category;

        // Get Products from the DB
        const products = await Product.findAll({ where: { category: productCategory } });

        res.json(products);

    } catch(err) {
        console.log(err);
    }
}

const shop_get_product = async (req, res) => {
    try {
        const productID = req.params.id;
        // Get the Product from the DB
        let product = await Product.findByPk(productID, {
            include: [{
                model: ProductImage,
                as: "Product_image"
            }],
        });

        res.json(product);

    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    shop_index,
    shop_get_filtered_products,
    shop_get_product
};