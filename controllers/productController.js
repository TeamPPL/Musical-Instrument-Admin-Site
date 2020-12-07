const { MongoClient, MongoParseError, ObjectID } = require('mongodb');
const productModel = require('../models/productModel');
const cloudinary = require('../cloudinary/cloudinary');
const formidable = require('formidable');

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
exports.updateProduct = async (req, res, next) => {

  const inStock = req.body.qty;
  const id = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const instruments = req.body.instruments;

  let productDetail = {
    id:id,
    title: title,
    description: description,
    filter: instruments,
    price: parseInt(price.substring(1, )),
    inStock: parseInt(inStock),
};

  console.log("stat: " + id);

  const result = await productModel.updateAProduct(productDetail);

  // console.log(result);

  // if (result. === 0)
  //   res.send("Remove failed!");
  // else
  res.redirect('/products/detail/' + id);
  //console.log(productItems);

};

  exports.removeProduct = async (req, res, next) => {
    let id = req.body.id;
    console.log(id);
    const result = await productModel.removeOne(id);

    console.log(req);

    if (result.deletedCount === 0)
      res.send("Remove failed!");
    else
      res.redirect(req.get('referer')); //refresh
    //console.log(productItems);
};

exports.getAddProduct =(req, res, next) => {
  res.render('products/addproduct');
}

exports.addProduct = async (req, res, next) => {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files) {
      let temp_path = files.cover.path;
      let upload = await cloudinary.uploader.upload(temp_path ,{folder: "imgdb"}, function(error, result) {console.log(result, error)});
      const title = fields.title;
      const cover = upload.secure_url;
      const description = fields.description;
      const filter = fields.filter;
      const price = fields.price;
      const inStock = fields.inStock;
      const sold = fields.sold;
      const manufacturer = fields.manufacturer;
    
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
    }
    await console.log(upload.secure_url);
  });


  //next();
}
