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
    }).toArray();
    //console.log(id);
    //console.log(productsCollection);
    //console.log(products);
    
    return relatedProducts;
}

exports.lastestProducts = async (id) => {
    const productsCollection = db().collection('product');
    // db().collection('test-product').insert({
    //     title: 'TEST',
    //     cover: 'https://i.pinimg.com/originals/b6/f7/d6/b6f7d6ac3fc2a93d04cb0020877c7fea.jpg',
    //     filter: 'guitar',
    //     price: 500,
    //     discount: 0,
    // });
    let lastestProducts = await productsCollection.find({}).sort({uploadedDate: -1}).limit(8).toArray();

    return lastestProducts;
}

exports.removeOne = async (id) => {
    const productsCollection = db().collection('product-test');
    try {
        let result = await productsCollection.deleteOne({
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
    try {
        await productsCollection.insertOne(newProduct);
        //console.log('insert success');
    } catch (err) {
        return console.log('Database Connection Error!', err.message);
    }
}
exports.updateAProduct = async (updatedProduct) => {
    const productsCollection = db().collection('product');
    console.log(updatedProduct.id);
    let result = undefined;
    try {
        result = await productsCollection.updateOne(
            {
            _id: ObjectId(updatedProduct.id)
            },
            {
                $set :
                {
                    title: updatedProduct.title,
                    description: updatedProduct.description,
                    filter: updatedProduct.filter,
                    price: updatedProduct.price,
                    inStock: updatedProduct.inStock,
                }
            });
    } catch (err) {
        return console.log('Database Connection Error!', err.message);
    }
    return result;

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