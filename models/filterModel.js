const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/dal');

exports.list = async () => {
    const productsCollection = db().collection('filter');
    let products = await productsCollection.find({}).toArray();
    //console.log(products);
    
    return products;
}