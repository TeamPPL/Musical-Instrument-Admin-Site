const ObjectId = require('mongodb').ObjectId;
const {db} = require('../dal/db');


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

// function CoomentList(cmtOfProduct) {
//     this.items = oldCart.items || {};
//     this.totalQty = oldCart.totalQty || 0;
//     this.totalPrice = oldCart.totalPrice || 0;

//     this.updateData = async function() {
//         for (var item_id in this.items){
//             try{
//                 let product = await productModel.findById(item_id);
//                 this.items[item_id].item = await product;
//                 this.items[item_id].price = (parseFloat(this.items[item_id].item.price) -
//                     parseFloat(this.items[item_id].item.discount?this.items[item_id].item.discount:0)) * parseInt(this.items[item_id].qty);
//             }catch (err){
//                 console.log('item in cart failed update');
//             }
//         }
//         //this.updateQuantity();
//     }

//     this.add = async function(item, id) {
//         //item = await productModel.findById(id);
//         let storedItem = this.items[id];
//         if (!storedItem){
//             storedItem = this.items[id] = {item: item, qty: 0, price: 0};
//         }
//         storedItem.qty++;
//         await this.updateData();
//         this.updateQuantity();
//         console.log(this.items);
//     }

//     this.updateQuantity = function(){
//         let new_quantity = 0; 
//         let total = 0;  
//         for (var item_id in this.items){
//             let qty = this.items[item_id].qty;
//             total += this.items[item_id].price;
//             new_quantity += qty;
//         }
//         this.totalPrice = total;
//         this.totalQty = new_quantity;
//     }

//     this.update = async function(id, new_quantity) {
//         await this.updateData();
//         this.items[id].qty = parseInt(new_quantity);
//         this.items[id].price = (parseFloat(this.items[id].item.price) - parseFloat(this.items[id].item.discount?this.items[id].item.discount:0))* this.items[id].qty;
//         this.updateData();
//         this.updateQuantity();
//     }

//     this.remove = async function(id){
//         await this.updateData();
//         delete this.items[id];
//         this.updateQuantity();
//     }

//     this.generateArray = function() {
//         let arr = [];
//         for (var id in this.items) {
//             arr.push(this.items[id]);
//         }
//         return arr;
//     }
// }
