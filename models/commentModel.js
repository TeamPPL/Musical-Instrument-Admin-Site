const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/dal');


exports.getCommentOfProducts = async(id) => {
    const CommentCollection = db().collection('Comments');
    let comments = await CommentCollection.find({ID_Product : id}).toArray();

    let ArrCmt = [];

    if(comments.length > 0){
        const UserCollection = await db().collection('account');
        let name = "";

        for (let element of comments) {
            let contents = await UserCollection.findOne({_id: ObjectId(element.ID_User)});

            name = contents.name;
            ArrCmt.push({
                NamePerson: name,
                Comment: element.comment,
                Star: element.star,
            });

          }
    }
    else{
        // do nothing
    }


    return ArrCmt;
}

exports.insertOne = async(objectCmt) => {
    const commentCollection = db().collection('Comments');
    try {
        await commentCollection.insertOne(objectCmt);
      } catch (err) {
        return console.log('Database Connection Error!', err.message);
    }
}

exports.totalComment = async(idProduct) => {
    const CommentCollection = db().collection('Comments');
    let comments = await CommentCollection.find({ID_Product : idProduct}).toArray();

    return comments.countDocuments();
}