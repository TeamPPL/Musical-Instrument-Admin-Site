const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/dal');

exports.list = async () => {
  const accountCollection = db().collection('account');
  let accounts = await accountCollection.find({}).toArray();
  //console.log(products);
  
  return accounts;
}

exports.getTotalCount = async () => {
  const accountCollection = db().collection('account')
  let totalNum = await accountCollection.countDocuments();
  //console.log(totalNum);
  return totalNum;
}

exports.getProductsAtPage = async (pageNumber, nPerPage) => {
  const accountCollection = db().collection('account');
  let accounts = await accountCollection.find({})
      .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
      .sort({username: 1})
      .limit(nPerPage)
      .toArray();
  //console.log(products);
  return accounts;
}

exports.filter = async (sorted, nPerPage, pageNumber) => {
  const accountCollection = db().collection('account');
  let sortQuery = {};

  if (sorted === "alphabet-asc") {
      sortQuery.username = 1;
  } else if (sorted === "alphabet-desc") {
      sortQuery.username = -1;
  } else if (sorted === "lastest") {
      sortQuery.createdDate = -1;
  } else if (sorted === "oldest") {
      sortQuery.createdDate = 1;
  }
  let accounts = await accountCollection.find({})
      .sort(sortQuery)
      .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
      .limit(nPerPage)
      .toArray();
      
  return accounts;
}

exports.lockAccount = async (id) => {
  const accountCollection = db().collection('account');
  let result = undefined;

  try {
      result = await accountCollection.findOneAndUpdate(
          {
          _id: ObjectId(id)
          },
          {
              $set : {
                isLocked: true
              }
          });
  } catch (err) {
      return console.log('Database Connection Error!', err.message);
  }
  return result;
}

exports.unlockAccount = async (id) => {
  const accountCollection = db().collection('account');
  let result = undefined;

  try {
      result = await accountCollection.findOneAndUpdate(
          {
          _id: ObjectId(id)
          },
          {
              $set : {
                isLocked: false
              }
          });
  } catch (err) {
      return console.log('Database Connection Error!', err.message);
  }
  return result;
}