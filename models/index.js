'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const { DataTypes} = require('sequelize');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config, 
    dialectOptions= {
      instanceName: config.instancename,
      domain: config.domain
    }
);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config, 
    dialectOptions= {
      instanceName: config.instancename,
      domain: config.domain
    }
    );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.products = require("./Product.model")(sequelize, DataTypes);
db.product_images = require("./ProductImage.model")(sequelize, DataTypes);
db.orders = require("./Order.model")(sequelize, DataTypes);

// One to Many Relationship
// Product has many Product Image
db.products.hasMany(db.product_images, {
  foreignKey: "product_id",
  as: "Product_image",
  onDelete: "CASCADE"
})

db.product_images.belongsTo(db.products, {
  foreignKey: "product_id",
  as: "product"
})

// Order has many Products
db.orders.hasMany(db.products, {
  foreignKey: "order_id",
  as: "Product",
})

db.products.belongsTo(db.orders, {
  foreignKey: "order_id",
  as: "order"
})

module.exports = db;
