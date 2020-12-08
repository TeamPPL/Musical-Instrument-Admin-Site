const { MongoClient, MongoParseError, ObjectID } = require('mongodb');
const productModel = require('../models/productModel');
const cloudinary = require('../cloudinary/cloudinary');
const fs = require('fs');
const formidable = require('formidable');

exports.index = async (req, res, next) => {
  let pageNumber = req.query.page;
  let nPerPage = req.query.show;

  if (pageNumber === "" || isNaN(pageNumber)) {
      pageNumber = 1;
  } else {
      pageNumber = parseInt(pageNumber);
      if (pageNumber <= 0)
          pageNumber = 1;
  }

  if (nPerPage === "" || isNaN(nPerPage)) {
      nPerPage = 9;
  } else {
      nPerPage = parseInt(nPerPage);
      if (nPerPage <= 0)
          nPerPage = 9;
  }

  //console.log(`${pageNumber}  ${nPerPage}`);
  const productItems = await productModel.getProductsAtPage(pageNumber, nPerPage);
  const totalCount = await productModel.getTotalCount();

  let totalPage = Math.ceil(totalCount / nPerPage);
  let isFirstPage = pageNumber === 1;
  let isLastPage = pageNumber === totalPage;

  let leftOverPage = 4;
  let pageList = [];

  //go backward
  for(let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i)
  {
      pageList.push({
          index: i,
          isCurrentPage: false
      });
      leftOverPage--;
  }

  pageList.push({
      index: pageNumber,
      isCurrentPage: true
  });

  //go forward
  for(let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i)
  {
      pageList.push({
          index: i,
          isCurrentPage: false
      });
      leftOverPage--;
  }

  //console.log(productItems);
  let pageInfo = {
      totalCount,
      totalPage,
      currentPage: pageNumber,
      prevPage: pageNumber - 1,
      nextPage: pageNumber + 1,
      firstItemOfPage: pageNumber > 0 ? (pageNumber - 1) * nPerPage + 1 : 1,
      lastItemOfPage: productItems.length < nPerPage ? (pageNumber - 1) * nPerPage +  productItems.length :  pageNumber * nPerPage - 1,
      isFirstPage,
      isLastPage,
      pageList
  }
  //console.log(pageInfo);
  res.render('products/products', {pageInfo, productItems});
};

exports.filter = async (req, res, next) => {
  let sorted = req.body.sorted;
  let nPerPage = req.body.nPerPage;
  let pageNumber = req.body.pageNumber;
  let searchText = req.body.search;

  console.log(searchText);

  console.log(`${sorted} ${nPerPage}`);

  if (nPerPage === "" || isNaN(nPerPage)) {
      nPerPage = 9;
  } else {
      nPerPage = parseInt(nPerPage);
      if (nPerPage <= 0)
          nPerPage = 9;
  }
  if (pageNumber === "" || isNaN(pageNumber)) {
      pageNumber = 1;
  } else {
      pageNumber = parseInt(pageNumber);
      if (pageNumber <= 0)
          pageNumber = 1;
  }

  //console.log(`${pageNumber}  ${nPerPage}`);
  const productItems = await productModel.filter(sorted, nPerPage, pageNumber, searchText);
  const totalCount = await productModel.getTotalCount(searchText);

  //console.log(productItems);

  let totalPage = Math.ceil(totalCount / nPerPage);
  let isFirstPage = pageNumber === 1;
  let isLastPage = pageNumber === totalPage;

  let leftOverPage = 4;
  let pageList = [];

  //go backward
  for(let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i)
  {
      pageList.push({
          index: i,
          isCurrentPage: false
      });
      leftOverPage--;
  }

  pageList.push({
      index: pageNumber,
      isCurrentPage: true
  });

  //go forward
  for(let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i)
  {
      pageList.push({
          index: i,
          isCurrentPage: false
      });
      leftOverPage--;
  }
  
  let pageInfo = {
      totalCount,
      totalPage,
      currentPage: pageNumber,
      prevPage: pageNumber - 1,
      nextPage: pageNumber + 1,
      firstItemOfPage: pageNumber > 0 ? (pageNumber - 1) * nPerPage + 1 : 1,
      lastItemOfPage: productItems.length < nPerPage ? (pageNumber - 1) * nPerPage +  productItems.length :  pageNumber * nPerPage - 1,
      isFirstPage,
      isLastPage,
      pageList
  }

  partials = fs.readFileSync('./views/partials/productItems.hbs', {encoding:'utf8', flag:'r'});
  console.log(pageInfo);
  res.send({partials, pageInfo, productItems});
  /*
  res.render('partials/productItems', { 
      pageInfo, 
      productItems
  });*/
  /*
  layout : false,
      data : {
          pageInfo, 
          productItems
      }
  });*/
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

  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    let imgCover = fields.oldCover;
    try{
    if (files) {
      let temp_path = files.cover.path;
      let upload = await cloudinary.uploader.upload(temp_path ,{folder: "imgdb"}, function(error, result) {console.log(result, error)});  
      imgCover = upload.secure_url;
    }
  }
  catch(e){

  }

    const id = fields.id;
    const title = fields.title;
    const description = fields.description;
    const filter = fields.filter;
    const price = fields.price;
    const inStock = fields.inStock;
    const sold = fields.sold;
    const manufacturer = fields.manufacturer;
  
    
    let productDetail = {
        "id": id,
        "title": title,
        "cover": imgCover,
        "description": description,
        "filter": filter,
        "price": price,
        "inStock": inStock,
        "sold": sold,
        "manufacturer": manufacturer,
        "modifiedDate": new Date()
    };
    console.log(productDetail);
    try {
      await productModel.updateAProduct(productDetail);
      res.redirect('/products/detail/' + id);
    }
    catch(error){
      
    } 
    //await console.log(upload.secure_url);
  });

  // console.log(result);

  // if (result. === 0)
  //   res.send("Remove failed!");
  // else
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
