const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/dal');

exports.list = async () => {
    const productsCollection = db().collection('product');
    let products = await productsCollection.find({}).toArray();
    //console.log(products);
    
    return products;
}

exports.findById = async (id) => {
    const productsCollection = db().collection('product');
    let product = await productsCollection.findOne({
        _id: ObjectId(id)
    });
    //console.log(id);
    //console.log(productsCollection);
    //console.log(products);
    
    return product;
}

exports.relatedProducts = async (id) => {
    const productsCollection = db().collection('product');
    let product = await productsCollection.findOne({
        _id: ObjectId(id)
    });
    let relatedProducts = await productsCollection.find({
        filter: product.filter
    }).limit(5).toArray();

    console.log(product._id);
    let key = -1;
    // for      // cần loại trừ những sản phẩm trùng
    for(let entity of relatedProducts){
        console.log(entity);
        key = key + 1;
        if(entity._id.equals(product._id)){
            break;
        }
        else {
            // do nothing
        }
    }

    result = relatedProducts.slice(0,key).concat(relatedProducts.slice(key+1,relatedProducts.length));
    if(result.length > 4){
        result.pop();   
    }

    //console.log(id);
    //console.log(productsCollection);
    //console.log(products);
    
    return result;
}

exports.lastestProducts = async (id) => {
    const productsCollection = db().collection('product');
    let lastestProducts = await productsCollection.find({}).sort({uploadedDate: -1}).limit(8).toArray();

    return lastestProducts;
}

exports.removeOne = async (id) => {
    const productsCollection = db().collection('product');
    let result;
    try {
        result = await productsCollection.deleteOne({
            _id: ObjectId(id)
        });
    } catch (err) {
        return console.log('Database Connection Error!', err.message);
    }

    //console.log(result);
    return result;
}

exports.insertOne = async (newProduct) => {
    const productsCollection = db().collection('product');
    await productsCollection.insertOne(newProduct);
}
exports.updateAProduct = async (updatedProduct) => {
    const productsCollection = db().collection('product');
    console.log(updatedProduct.id);
    //console.log(updatedProduct);
    let result = undefined;
    try {
        result = await productsCollection.updateOne(
            {
            _id: ObjectId(updatedProduct.id)
            },
            {
                $set :
                {
                    cover: updatedProduct.cover,
                    cover2: updatedProduct.cover,
                    cover3: updatedProduct.cover,
                    cover4: updatedProduct.cover,
                    title: updatedProduct.title,
                    description: updatedProduct.description,
                    filter: updatedProduct.filter,
                    price: updatedProduct.price,
                    inStock: updatedProduct.inStock,
                    discount: updatedProduct.discount,
                    sold: updatedProduct.sold,
                    sellPrice: updatedProduct.sellPrice,
                    modifiedDate: updatedProduct.modifiedDate,
                    manufacturer: updatedProduct.manufacturer
                }
            });
        
    } catch (err) {
        return console.log('Database Connection Error!', err.message);
    }
    return result;

}

exports.getTotalCount = async (search, minPrice, maxPrice, filter, manufacturer) => {
    const productsCollection = db().collection('product');
    if (!minPrice)
    {
        minPrice = 0;
    }
    
    if (!maxPrice)
    {
        maxPrice = 0;
    }

    let query = {
        title: {
            '$regex' : new RegExp(search, "i") 
        },
        $and : [
            {sellPrice: { "$gte": minPrice}},
            {sellPrice: { "$lte": maxPrice}}
        ],
    };

    if (filter !== "all")
    {
        query.filter = {
            '$regex' : new RegExp(filter, "i") 
        };
    }

    if (manufacturer !== "all")
    {
        query.manufacturer = {
            '$regex' : new RegExp(manufacturer, "i") 
        };
    }

    let products = await productsCollection.find(
        query
    );
    
    let totalNum = await products.count();
    //console.log(totalNum);
    return totalNum;
}

exports.getProductsAtPage = async (pageNumber, nPerPage) => {
    const productsCollection = db().collection('product');
    let products = await productsCollection.find({})
        .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
        .sort({title: 1})
        .limit(nPerPage)
        .toArray();
    //console.log(products);
    return products;
}

exports.filter = async (sorted, nPerPage, pageNumber, search, minPrice, maxPrice, filter, manufacturer) => {
    const productsCollection = db().collection('product');

    let sortQuery = {};

    if (sorted === "alphabet-asc") {
        sortQuery.title = 1;
    } else if (sorted === "alphabet-desc") {    
        sortQuery.title = -1;
    } else if (sorted === "lastest") {
        sortQuery.createdDate = -1;
    } else if (sorted === "oldest") {
        sortQuery.createdDate = 1;
    }

    if (!minPrice)
    {
        minPrice = 0;
    }
    
    if (!maxPrice)
    {
        maxPrice = 0;
    }

    let query = {
        title: {
            '$regex' : new RegExp(search, "i") 
        },
        $and : [
            {sellPrice: { "$gte": minPrice}},
            {sellPrice: { "$lte": maxPrice}}
        ],
    };

    if (filter !== "all")
    {
        query.filter = {
            '$regex' : new RegExp(filter, "i") 
        };
    }

    if (manufacturer !== "all")
    {
        query.manufacturer = {
            '$regex' : new RegExp(manufacturer, "i") 
        };
    }

    console.dir(manufacturer);

    let products = await productsCollection.find(
        query
        )
        .sort(sortQuery)
        .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
        .limit(nPerPage)
        .toArray();
        
        console.log(products);

    return products;
}

exports.top10Sale = async () => {
    const productsCollection = db().collection('product');
    let topSeller = await productsCollection.find({}).sort({sold: -1}).limit(10).toArray();
    return topSeller;
}

exports.updateStock = async (id, qty) => {
    const productsCollection = db().collection('product');
    let sold = -qty;
    console.log(qty);
    await productsCollection.findOneAndUpdate(
      { "_id": ObjectId(id) },
      {
        $inc: { 'inStock': qty, 'sold': sold }
        
      },
      {
        returnNewDocument: true
      }
      , function (error, result) {
        return error;
      }
    );
}
/*
return [
        {
            id: 1,
            title: 'Super Cool Guitar',
            cover: 'https://i.pinimg.com/564x/b1/f6/44/b1f6441229cedff6fcb5cbc8a10f35ae.jpg',
            filter: 'guitar',
            price: 999999,
            discount: 654985
        },
        {
            id: 2,
            title: 'Sherlock Violin',
            cover: 'https://i.pinimg.com/564x/cd/4e/24/cd4e2468a4ae1f5e01b27d49aee5aac2.jpg',
            filter: 'violin',
            price: 14022000,
            discount: 0
        },
        {
            id: 3,
            title: 'Heaven piano',
            cover: 'https://i.pinimg.com/564x/9f/75/c6/9f75c6bad3fbbd2683494b455e09ea2d.jpg',
            filter: 'piano',
            price: 50,
            discount: 0
        },
        {
            id: 4,
            title: 'Guitar',
            cover: 'https://i.pinimg.com/564x/15/7e/36/157e361ecf3de6940788e15110087f2e.jpg',
            filter: 'guitar',
            price: 50,
            discount: 48
        },
        {
            id: 5,
            title: 'Ultra piano',
            cover: 'https://i.pinimg.com/564x/a2/c2/29/a2c2296a3d3eb56795103ab7b94b98ff.jpg',
            filter: 'piano',
            price: 50,
            discount: 0
        },
        {
            id: 6,
            title: 'Guitar',
            cover: 'https://i.pinimg.com/564x/03/0e/c6/030ec6b6139cd55205116a036e22c3fa.jpg',
            filter: 'guitar',
            price: 50,
            discount: 0

        },
        {
            id: 7,
            title: 'Special drum',
            cover: 'https://i.pinimg.com/564x/72/24/51/72245132a2d200b5a7c17b2180d9a1fc.jpg',
            filter: 'drum',
            price: 50,
            discount: 0
        },
        {
            id: 8,
            title: 'Guitar',
            cover: 'https://i.pinimg.com/564x/16/6e/21/166e21e483d2060a623dabcb0faab152.jpg',
            filter: 'guitar',
            price: 50,
            discount: 30
        },
        {
            id: 9,
            title: 'Super Cool Guitar',
            cover: 'https://i.pinimg.com/564x/b1/f6/44/b1f6441229cedff6fcb5cbc8a10f35ae.jpg',
            filter: 'guitar',
            price: 999999,
            discount: 654985
        },
        {
            id: 10,
            title: 'Sherlock Violin',
            cover: 'https://i.pinimg.com/564x/cd/4e/24/cd4e2468a4ae1f5e01b27d49aee5aac2.jpg',
            filter: 'violin',
            price: 14022000,
            discount: 0
        },
        {
            id: 11,
            title: 'Heaven piano',
            cover: 'https://i.pinimg.com/564x/9f/75/c6/9f75c6bad3fbbd2683494b455e09ea2d.jpg',
            filter: 'piano',
            price: 50,
            discount: 0
        },
        {
            id: 12,
            title: 'Guitar',
            cover: 'https://i.pinimg.com/564x/15/7e/36/157e361ecf3de6940788e15110087f2e.jpg',
            filter: 'guitar',
            price: 50,
            discount: 48
        },
    ]
*/