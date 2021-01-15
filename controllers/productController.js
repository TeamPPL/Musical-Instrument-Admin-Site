const { MongoClient, MongoParseError, ObjectID } = require('mongodb');
const productModel = require('../models/productModel');
const cloudinary = require('../cloudinary/cloudinary');
const fs = require('fs');
const formidable = require('formidable');

exports.index = async (req, res, next) => {
  let sorted = req.query.sorted;
  let nPerPage = req.query.nPerPage;
  let pageNumber = req.query.pageNumber;
  let searchText = req.query.search;
  let priceMin = req.query.priceMin;
  let priceMax = req.query.priceMax;
  let filter = req.query.filter;
  let manufacturer = req.query.manufacturer;


  //Default pageNum
  if (pageNumber === "" || isNaN(pageNumber)) {
    pageNumber = 1;
  } else {
    pageNumber = parseInt(pageNumber);
    if (pageNumber <= 0)
      pageNumber = 1;
  }

  //Default item per page
  if (nPerPage === "" || isNaN(nPerPage)) {
    nPerPage = 9;
  } else {
    nPerPage = parseInt(nPerPage);
    if (nPerPage <= 0)
      nPerPage = 9;
  }

  //Default sort type
  if (sorted) {
    if (sorted !== "alphabet-asc" && sorted !== "alphabet-desc" && sorted !== "lastest" && sorted !== "oldest") {
      req.flash("error", "Wrong type of sorting!");
      res.redirect("/error");
    }
  } else {
    sorted = "alphabet-asc";
  }

  //Default prices
  if (priceMin && priceMax) {
    priceMin = priceMin.split("$")[1];
    priceMax = priceMax.split("$")[1];

    priceMin = parseInt(priceMin);
    priceMax = parseInt(priceMax);
  } else {
    priceMin = 0;
    priceMax = 9000;
  }

  //Default filter: all products
  if (!filter || filter === "") {
    filter = "all";
  }

  //Default manufacturer: all manufacturer
  if (!manufacturer || manufacturer === "") {
    manufacturer = "all"
  }

  //console.log(`${pageNumber}  ${nPerPage}`);
  const productItems = await productModel.filter(sorted, nPerPage, pageNumber, searchText, priceMin, priceMax, filter, manufacturer);
  const totalCount = await productModel.getTotalCount(searchText, priceMin, priceMax, filter, manufacturer);

  let totalPage = Math.ceil(totalCount / nPerPage);
  let isFirstPage = pageNumber === 1;
  let isLastPage = pageNumber === totalPage;

  let leftOverPage = 4;
  let pageList = [];

  //go backward
  for (let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i) {
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
  for (let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i) {
    pageList.push({
      index: i,
      isCurrentPage: false
    });
    leftOverPage--;
  }
  let isNotEmpty = totalPage > 0;
  //console.log(productItems);
  let pageInfo = {
    totalCount,
    totalPage,
    currentPage: pageNumber,
    prevPage: pageNumber - 1,
    nextPage: pageNumber + 1,
    firstItemOfPage: totalPage > 0 ? (pageNumber - 1) * nPerPage + 1 : 0,
    lastItemOfPage: productItems.length < nPerPage ? (pageNumber - 1) * nPerPage + productItems.length : pageNumber * nPerPage - 1,
    isFirstPage,
    isLastPage,
    pageList,
    isNotEmpty,
  }

  //filterOption
  let filterOption = {};

  switch (filter) {
    case "guitar":
      filterOption.isGuitar = true;
      break;
    case "violin":
      filterOption.isViolin = true;
      break;
    case "piano":
      filterOption.isPiano = true;
      break;
    case "drum":
      filterOption.isDrum = true;
      break;
    default:
      filterOption.isAll = true;
      break;
  }

  switch (manufacturer) {
    case "gibson":
      filterOption.isGibson = true;
      break;
    case "steinway":
      filterOption.isSteinway = true;
      break;
    case "sennheiser":
      filterOption.isSennheiser = true;
      break;
    case "yamaha":
      filterOption.isYamaha = true;
      break;
    case "roland":
      filterOption.isRoland = true;
      break;
    default:
      filterOption.isAllManufacturer = true;
      break;
  }

  res.render('products/products', { pageInfo, productItems, filterOption });
};

exports.update = async (req, res, next) => {
  const idProduct = req.params.id;
  const product = await productModel.findById(idProduct);
  res.render('products/updateProduct', {product});
}

exports.filter = async (req, res, next) => {
  let sorted = req.body.sorted;
  let nPerPage = req.body.nPerPage;
  let pageNumber = req.body.pageNumber;
  let searchText = req.body.search;
  let priceMin = req.body.priceMin;
  let priceMax = req.body.priceMax;
  let filter = req.body.filter;
  let manufacturer = req.body.manufacturer;

  //console.log(`${priceMin} ${priceMax}`);
  if (priceMin && priceMax) {
    priceMin = priceMin.split("$")[1];
    priceMax = priceMax.split("$")[1];

    priceMin = parseInt(priceMin);
    priceMax = parseInt(priceMax);
  } else {
    priceMin = 0;
    priceMax = 9000;
  }

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

  //Default filter: all products
  if (!filter || filter === '') {
    filter = "$all";
  }

  //Default manufacturer: all manufacturer
  if (!manufacturer || manufacturer === '') {
    manufacturer = "$all";
  }

  //console.log(`${pageNumber}  ${nPerPage}`);
  const productItems = await productModel.filter(sorted, nPerPage, pageNumber, searchText, priceMin, priceMax, filter, manufacturer);
  const totalCount = await productModel.getTotalCount(searchText, priceMin, priceMax, filter, manufacturer);

  //console.log(productItems);

  let totalPage = Math.ceil(totalCount / nPerPage);
  let isFirstPage = pageNumber === 1;
  let isLastPage = pageNumber === totalPage;

  let leftOverPage = 4;
  let pageList = [];

  //go backward
  for (let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i) {
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
  for (let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i) {
    pageList.push({
      index: i,
      isCurrentPage: false
    });
    leftOverPage--;
  }

  //Check empty
  let isNotEmpty = totalPage > 0;

  let pageInfo = {
    totalCount,
    totalPage,
    currentPage: pageNumber,
    prevPage: pageNumber - 1,
    nextPage: pageNumber + 1,
    firstItemOfPage: totalPage > 0 ? (pageNumber - 1) * nPerPage + 1 : 0,
    lastItemOfPage: productItems.length < nPerPage ? (pageNumber - 1) * nPerPage + productItems.length : pageNumber * nPerPage - 1,
    isFirstPage,
    isLastPage,
    pageList,
    isNotEmpty,
  }

  console.log(pageInfo);
  res.send({ pageInfo, productItems });
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
    if (files) {
      let cover = fields.fakeInput;
      let cover2 = fields.fakeInput2;
      let cover3 = fields.fakeInput3;
      let cover4 = fields.fakeInput4;

      const temp_path = files.cover.path;
      try {
        let upload = await cloudinary.uploader.upload(temp_path, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
        cover = upload.secure_url;
      }
      catch {
        cover = fields.fakeInput;
      }

      let upload2 = undefined;
      let upload3 = undefined;
      let upload4 = undefined;
      const temp_path2 = files.cover2.path;
      if (temp_path2) {
        try {
          upload2 = await cloudinary.uploader.upload(temp_path2, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
          cover2 = upload2.secure_url;
        } catch {
          cover2 = fields.fakeInput2;
        }
      }
      const temp_path3 = files.cover3.path;
      console.log(temp_path3);
      if (temp_path3) {
        try {
          upload3 = await cloudinary.uploader.upload(temp_path3, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
          cover3 = upload3.secure_url;
        } catch {
          cover3 = fields.fakeInput3;
        }
      }
      const temp_path4 = files.cover4.path;
      if (temp_path4) {
        try {
          upload4 = await cloudinary.uploader.upload(temp_path4, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
          cover4 = upload4.secure_url;
        } catch {
          cover4 = fields.fakeInput4;
        }
      }
      console.log(cover);
      const id = fields.id;
      const title = fields.title;
      const description = fields.description;
      const filter = fields.filter;
      const price = parseFloat(fields.price);
      const inStock = fields.inStock;
      const sold = fields.sold;
      const manufacturer = fields.manufacturer;
      const discount = parseFloat(fields.discount);
      const sellPrice = price - discount;

      let productDetail = {
        "id": id,
        "title": title,
        "cover": cover,
        "cover2": cover2,
        "cover3": cover3,
        "cover4": cover4,
        "sellPrice": sellPrice,
        "discount": discount,
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
        productModel.updateAProduct(productDetail);
        //var message = "ADDED SUCCESSFULLY";
         res.redirect('/products/detail/' + productDetail.id);
         return;
        //res.render('products/addproduct', { productDetail, message });
      }
      catch (error) {

      }
    }
    else{
      res.send("error");
    }
    //await console.log(upload.secure_url);
  });


  // const inStock = req.body.qty;
  // const id = req.body.id;
  // const title = req.body.title;
  // const price = req.body.price;
  // const description = req.body.description;
  // const instruments = req.body.instruments;

  // let productDetail = {
  //   id: id,
  //   title: title,
  //   description: description,
  //   filter: instruments,
  //   price: parseInt(price.substring(1,)),
  //   inStock: parseInt(inStock),
  // };
  // const form = formidable({ multiples: true });
  // form.parse(req, async (err, fields, files) => {
  //   if (err) {
  //     next(err);
  //     return;
  //   }
  //   let imgCover = fields.oldCover;
  //   try {
  //     if (files) {
  //       let temp_path = files.cover.path;
  //       let upload = await cloudinary.uploader.upload(temp_path, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
  //       imgCover = upload.secure_url;
  //     }
  //   }
  //   catch (e) {

  //   }

  //   const id = fields.id;
  //   const title = fields.title;
  //   const description = fields.description;
  //   const filter = fields.filter;
  //   const price = fields.price;
  //   const inStock = fields.inStock;
  //   const sold = fields.sold;
  //   const manufacturer = fields.manufacturer;


  //   let productDetail = {
  //     "id": id,
  //     "title": title,
  //     "cover": imgCover,
  //     "description": description,
  //     "filter": filter,
  //     "price": price,
  //     "inStock": inStock,
  //     "sold": sold,
  //     "manufacturer": manufacturer,
  //     "modifiedDate": new Date()
  //   };
  //   console.log(productDetail);
  //   try {
  //     await productModel.updateAProduct(productDetail);
  //     res.redirect('/products/detail/' + id);
  //   }
  //   catch (error) {

  //   }
  //   //await console.log(upload.secure_url);
  // });

  // // console.log(result);

  // // if (result. === 0)
  // //   res.send("Remove failed!");
  // // else
  // //console.log(productItems);

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

exports.getAddProduct = (req, res, next) => {
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
      let cover = "";
      let cover2 = "";
      let cover3 = "";
      let cover4 = "";

      const temp_path = files.cover.path;
      try {
        let upload = await cloudinary.uploader.upload(temp_path, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
        cover = upload.secure_url;
      }
      catch {
        cover = "";
      }

      let upload2 = undefined;
      let upload3 = undefined;
      let upload4 = undefined;
      const temp_path2 = files.cover2.path;
      if (temp_path2) {
        try {
          upload2 = await cloudinary.uploader.upload(temp_path2, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
          cover2 = upload2.secure_url;
        } catch {
          cover2 = "";
        }
      }
      const temp_path3 = files.cover3.path;
      console.log(temp_path3);
      if (temp_path3) {
        try {
          upload3 = await cloudinary.uploader.upload(temp_path3, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
          cover3 = upload3.secure_url;
        } catch {
          cover3 = "";
        }
      }
      const temp_path4 = files.cover4.path;
      if (temp_path4) {
        try {
          upload4 = await cloudinary.uploader.upload(temp_path4, { folder: "imgdb" }, function (error, result) { console.log(result, error) });
          cover4 = upload4.secure_url;
        } catch {
          cover4 = "";
        }
      }

      const title = fields.title;
      const description = fields.description;
      const filter = fields.filter;
      const price = parseFloat(fields.price);
      const inStock = fields.inStock;
      const sold = fields.sold;
      const manufacturer = fields.manufacturer;
      const discount = parseFloat(fields.discount);
      const sellPrice = price - discount;

      let productDetail = {
        "title": title,
        "cover": cover,
        "cover2": cover2,
        "cover3": cover3,
        "cover4": cover4,
        "sellPrice": sellPrice,
        "discount": discount,
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
        var message = "ADDED SUCCESSFULLY";
        res.render('products/addproduct', { productDetail, message });
      }
      catch (error) {

      }
    }
    else{
      res.send("error");
    }
    await console.log(upload.secure_url);
  });


  //next();
}
