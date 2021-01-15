const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/dal');

exports.checkSuperAdmin = async (username) => {
  const accountCollection = db().collection('super-admin');
  //console.log(name);
  const account = await accountCollection.findOne({
      username: username
  });

  return account;
}

exports.checkSuperAdminId = async (id) => {
  const accountCollection = db().collection('super-admin');
  //console.log(name);
  const account = await accountCollection.findOne({
      _id: ObjectId(id)
  });

  return account;
}

exports.findAdminByUsername = async (name) => {
  const accountCollection = db().collection('admin-accounts');
  //console.log(name);
  const account = await accountCollection.findOne({
      username: name
  });

  return account;
}

exports.findAdminByEmail = async (email) => {
  const accountCollection = db().collection('admin-accounts');
  //console.log(name);
  const account = await accountCollection.findOne({
      email: email
  });

  return account;
}

exports.findAdminById = async (id) => {
  const accountCollection = db().collection('admin-accounts');
  let account = await accountCollection.findOne({
      _id: ObjectId(id)
  });
  
  return account;
}

exports.updateAAccount = async (updatedAccount) => {
  const accountCollection = db().collection('admin-accounts');
  let result = undefined;

  try {
      result = await accountCollection.findOneAndUpdate(
          {
          username: updatedAccount.username
          },
          {
              $set : updatedAccount
          });
  } catch (err) {
      return console.log('Database Connection Error!', err.message);
  }
  return result;
}

exports.updateAvatar = async (temp_path) => {
  var upload = await cloudinary.uploader.upload(temp_path, {folder: "imgdb"}, function(error, result) {
    console.log(result, error);
  });
  return upload;
}

exports.insertOne = async (accountInfos) => {
  const accountCollection = db().collection('admin-accounts');
  try {
    await accountCollection.insertOne(accountInfos);
  } catch (err) {
    return console.log('Database Connection Error!', err.message);
}
}

exports.lockAccount = async (id) => {
  const accountCollection = db().collection('admin-accounts');
  let result = undefined;

  try {
      result = await accountCollection.findOneAndUpdate(
          {
          _id: id
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
  const accountCollection = db().collection('admin-accounts');
  let result = undefined;

  try {
      result = await accountCollection.findOneAndUpdate(
          {
          _id: id
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

exports.updatePassword = async (identifier, hashedPass) => {
  const accountCollection = db().collection('admin-accounts');
  let result = undefined;

  try {
      result = await accountCollection.findOneAndUpdate(
          identifier,
          {
            $set : {
              password: hashedPass
            }
          });
  } catch (err) {
      return console.log('Database Connection Error!', err.message);
  }
  return result;
}

exports.getTotalCount = async () => {
  const accountCollection = db().collection('admin-accounts')
  let totalNum = await accountCollection.countDocuments();
  //console.log(totalNum);
  return totalNum;
}

exports.filter = async (sorted, nPerPage, pageNumber) => {
  const accountCollection = db().collection('admin-accounts');
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
  const accountCollection = db().collection('admin-accounts');
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
  const accountCollection = db().collection('admin-accounts');
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