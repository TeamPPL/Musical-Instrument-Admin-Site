const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/dal');

exports.list = async () => {
  const accountCollection = db().collection('account');
  let accounts = await accountCollection.find({}).toArray();
  //console.log(products);
  
  return accounts;
}

exports.removeOne = async (id) => {
  const accountCollection = db().collection('account');
  let result = await accountCollection.deleteOne({
    _id: ObjectId(id)
  });
  
  return result;
}