const carouselModel = require('../models/carouselModel');
const productModel = require('../models/productModel');
const specialOfferModel = require('../models/specialOfferModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const carouselItems = carouselModel.list();
    const lastestProductItems = await productModel.lastestProducts();
    const specialOfferItems = await specialOfferModel.list();
    console.log(specialOfferItems);
    // Pass data to view to display list of books
    res.render('index', {carouselItems, lastestProductItems, specialOfferItems});
};