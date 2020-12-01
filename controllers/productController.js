const { MongoClient, MongoParseError, ObjectID } = require('mongodb');
const productModel = require('../models/productModel');

exports.index = async (req, res, next) => {
  const productItems = await productModel.list();
  //console.log(productItems);
  res.render('products/products', {productItems});
};

// exports.addProduct1 = (req,res) => {
//     const item = new product({
        
//         _id: ObjectID,
//         title: req.body.title,
//         description: req.body.description,
//         price: req.body.price,
//         filter: req.body.filter,
//         cover: req.body.cover,
//     });
    
//     return item
//       .save()
//       .then((newProduct) => {
//         return res.status(201).json({
//           success: true,
//           message: 'New cause created successfully',
//           Product: newProduct,
//         });
//       })
//       .catch((error) => {
//           console.log(error);
//         res.status(500).json({
//           success: false,
//           message: 'Server error. Please try again.',
//           error: error.message,
//         });
//       });
//   }

exports.getAddProduct =(req, res, next) => {
  res.render('products/addproduct');
}

exports.addProduct = async (req, res, next) => {
  const title = req.body.title;
  const cover = req.body.cover;
  const description = req.body.description;
  const filter = req.body.filter;
  const price = req.body.price;
  const inStock = req.body.inStock;
  const sold = req.body.sold;
  const manufacturer = req.body.manufacturer;


  let productDetail = {
      "title": title,
      "cover": cover,
      "description": description,
      "filter": filter,
      "price": price,
      "inStock": inStock,
      "sold": sold,
      "manufacturer": manufacturer,
      "createdDate": new Date(),
      "modifiedDate": new Date()
  };
  try {
    productModel.insertOne(productDetail);
    var message="ADDED SUCCESSFULLY";
    res.render('products/addproduct',{productDetail,message});
  }
  catch(err){
    
  }

  //next();
}
