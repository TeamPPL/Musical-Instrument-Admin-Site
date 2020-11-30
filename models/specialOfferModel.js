const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/dal');

exports.list = async () => {
    const specialOfferCollection = db().collection('special-offer');
    let specialOffers = await specialOfferCollection.find({}).toArray();

    return specialOffers;
}