//-----------------------  Packages -------------------------
const sharp = require('sharp');
const path = require('path');
const { unlink } = require('fs/promises');
const db = require("../../models");
//----------------------  Models -------------------------
const Product = db.products;
const ProductImage = db.product_images;

//----------------------  Functions -------------------------
const dashboard_index = (req, res) => {
    res.send("Dashboard");
}

const dashboard_get_products = async (req, res) => {
    try {
        // Get All Products from the DB
        const products = await Product.findAll();

        res.json(products);

    } catch(err) {
        console.log(err);
    }
}

const dashboard_get_filtered_products = async (req, res) => {
    try {
        const productCategory = req.params.category;

        // Get Products from the DB
        const products = await Product.findAll({ where: { category: productCategory } });

        res.json(products);

    } catch(err) {
        console.log(err);
    }
}

const dashboard_create_product = async (req, res) => {
    try {
        const productData = req.body;
        const productImageData = {};

        // Create Thumbnail
        // Thumbnail File Name
        const thumbFileName = Date.now() + '--thumbnail' + path.extname(req.files[0].filename).toLowerCase();
        // Resize Image0 and Save File with its declared File Name
        await sharp(req.files[0].path)
            .resize({ width: 600 })
            .toFile("public/images/product_images/" + thumbFileName);

        // Add Thumbnail Path Property to Product Object
        productData["image_thumbnail"] = thumbFileName;

        // Save Product to Database
        const product = await Product.create(productData);

        for(let i = 0; i < req.files.length; i++) {
            // Add Properties to Product Image Object
            productImageData["product_id"] = product.dataValues.id;
            productImageData["image_path"] = req.files[i].filename;

            // Save Image to Database
            await ProductImage.create(productImageData);
        }

        res.json({ Statut: "The Product has been successfully added" });

    } catch(err) {
        console.log(err);
    }
}

const dashboard_delete_product = async (req, res) => {
    try {
        const productID = req.params.id;

        let productData = await Product.findByPk(productID, {
            include: [{
                model: ProductImage,
                as: "Product_image"
            }],
        });

        productImageArr = productData.Product_image;

        await Product.destroy({ where: { id: productID } });

        // Delete Thumbnail Image from Server
        await unlink("public/images/product_images/" + productData["image_thumbnail"]);

        // Delete Article Images from Server
        for(let i = 0; i <= productImageArr.length - 1; i++) {
            // Delete Image
            await unlink("public/images/product_images/" + productImageArr[i]["image_path"]);
        }

        res.json({ Message: "The Product has been deleted" });
   
    } catch(err) {
        console.log(err);
    }
}


module.exports = {
    dashboard_index,
    dashboard_get_products,
    dashboard_get_filtered_products,
    dashboard_create_product,
    dashboard_delete_product
};