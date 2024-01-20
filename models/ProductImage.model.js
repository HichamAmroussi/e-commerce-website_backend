module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define("Product_image", {
        image_path: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    return ProductImage;
}