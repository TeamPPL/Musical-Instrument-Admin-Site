const productModel = require('../models/productModel');

const MAX_RELATED_PRODUCT_PER_PAGE = 4;

exports.index = async (req, res, next) => {
    const idProduct = req.params.id;
    const productItems = await productModel.findById(idProduct);
    const allRelatedProducts = await productModel.relatedProducts(idProduct);

    //console.log(currentProduct);

/*
    const productItems = productModel.list()[idProduct - 1];
    const allRelatedProducts = function(){
        let relatedProducts = [];  

        let i = 0;
        productModel.list().forEach(element => {
            if (i < 4) {
                // break;
                if (((element.filter).localeCompare(productItems.filter) == 0) && (element.id != productItems.id)) {
                    relatedProducts.push(element);
                }
                else {
                    // do nothing
                }
            }
            else {
                i++;
                // do nothing
            }
        });

        return relatedProducts;
    };
*/
    res.render('products/detail/detail', {productItems, allRelatedProducts});
};