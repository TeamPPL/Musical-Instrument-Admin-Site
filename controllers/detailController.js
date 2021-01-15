const productModel = require('../models/productModel');
const filterModel = require('../models/filterModel');
const commentModel = require('../models/commentModel');

const MAX_RELATED_PRODUCT_PER_PAGE = 4;

exports.index = async (req, res, next) => {
    const idProduct = req.params.id;
    const productItems = await productModel.findById(idProduct);
    const allRelatedProducts = await productModel.relatedProducts(idProduct);    
    const comments = await commentModel.getCommentOfProducts(idProduct);
    // const filterProducts = await filterModel.list();
    //console.log(currentProduct);

    let average = 0;
    if(comments.length > 0){
        let sum = 0;
        for(var item of comments){
            sum = sum + item.Star;
        }
        average = Math.round(sum * 1.0 / (comments.length))
    }
    else{
        // do nothing
    }

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
res.render('products/detail/detail', {productItems, allRelatedProducts, comments, countCmt : comments.length, AverageReview : average});
};