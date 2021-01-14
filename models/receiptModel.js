const ObjectId = require('mongodb').ObjectId;
const { db } = require('../dal/dal');

exports.insertOne = async (receipt) => {
  const receiptCollection = db().collection('receipt');
  try {
    await receiptCollection.insertOne(receipt);
  } catch (err) {
    return console.log('Database Connection Error!', err.message);
  }
}

exports.findById = async (id) => {
  const receiptCollection = db().collection('receipt');
  let receipt = await receiptCollection.findOne({
    _id: ObjectId(id)
  });
  return receipt;
}

exports.userList = async () => {
  const receiptCollection = db().collection('receipt');
  let receipt = await receiptCollection.find({}).toArray();
  return receipt;
}

exports.getReceiptsAtPage = async (pageNumber, nPerPage) => {
  const receiptCollection = db().collection('receipt');
  let receipts = await receiptCollection.find({})
    .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
    .sort({ createdDate: -1 })
    .limit(nPerPage)
    .toArray();
  return receipts;
}

exports.getTotalCount = async () => {
  const receiptCollection = db().collection('receipt')
  let receipts = await receiptCollection.find({});
  let totalNum = receipts.count();
  return totalNum;
}

exports.filter = async (sorted, nPerPage, pageNumber) => {
  const receiptCollection = db().collection('receipt');
  let sortQuery = {};

  if (sorted === "alphabet-asc") {
    sortQuery.totalPrice = 1;
  } else if (sorted === "alphabet-desc") {
    sortQuery.totalPrice = -1;
  } else if (sorted === "lastest") {
    sortQuery.createdDate = -1;
  } else if (sorted === "oldest") {
    sortQuery.createdDate = 1;
  }
  let receipt = await receiptCollection.find({})
    .sort(sortQuery)
    .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
    .limit(nPerPage)
    .toArray();

  return receipt;
}

exports.updateStatusOne = async (id, status) => {
  const receiptCollection = db().collection('receipt');
  receiptCollection.findOneAndUpdate(
    { "_id": ObjectId(id) },
    {
      $set: { 'status': status }
    },
    {
      returnNewDocument: true
    }
    , function (error, result) {
      return error;
    }
  );

}