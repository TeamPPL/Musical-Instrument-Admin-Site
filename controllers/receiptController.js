const { fail } = require('assert');
const fs = require('fs');
const receiptModel = require('../models/receiptModel');

exports.purchaseHistory = async (req, res, next) => {
    // if (req.user == undefined) {
    //     res.redirect('/');
    //     return;
    // }
    // let id = req.user._id;
    let receiptList = await receiptModel.userList();
    let Receipts = [];
    receiptList.forEach(item => {
        let newReceipt = {
            _id: item._id,
            name: item.info.name,
            createdDate: item.createdDate,
            totalPrice: item.totalPrice,
            status: ""
        }
        let newStatus = item.status;
        if (newStatus == 0) {
            newReceipt.status = "Pending";
        } else if (newStatus == 1) {
            newReceipt.status = "Delivering";
        } else if (newStatus == 2) {
            newReceipt.status = "Delivered";
        } else if (newStatus == -1) {
            newReceipt.status = "Canceled";
        } else {
            newReceipt.status = "Unknown";
        }
        Receipts.push(newReceipt);
    });

    res.render('receipt/purchaseHistory', { Receipts });
}

exports.index = async (req, res, next) => {
    // if (req.user == undefined) {
    //     res.redirect('/');
    //     return;
    // }

    // let id = req.user._id;
    let pageNumber = 1;
    let nPerPage = 5;

    const receiptList = await receiptModel.getReceiptsAtPage(pageNumber, nPerPage);
    const totalCount = await receiptModel.getTotalCount();

    let totalPage = Math.ceil(totalCount / nPerPage);
    let isFirstPage = pageNumber === 1;
    let isLastPage = pageNumber === totalPage;

    let leftOverPage = 4;
    let pageList = [];

    //go backward
    for (let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i) {
        pageList.push({
            index: i,
            isCurrentPage: false
        });
        leftOverPage--;
    }

    pageList.push({
        index: pageNumber,
        isCurrentPage: true
    });

    //go forward
    for (let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i) {
        pageList.push({
            index: i,
            isCurrentPage: false
        });
        leftOverPage--;
    }

    //console.log(productItems);
    let pageInfo = {
        totalCount,
        totalPage,
        currentPage: pageNumber,
        prevPage: pageNumber - 1,
        nextPage: pageNumber + 1,
        firstItemOfPage: pageNumber > 0 ? (pageNumber - 1) * nPerPage + 1 : 1,
        lastItemOfPage: receiptList.length < nPerPage ? (pageNumber - 1) * nPerPage + receiptList.length : pageNumber * nPerPage - 1,
        isFirstPage,
        isLastPage,
        pageList
    }

    let Receipts = [];
    receiptList.forEach(item => {
        let newReceipt = {
            _id: item._id,
            name: item.info.name,
            createdDate: item.createdDate,
            totalPrice: item.totalPrice,
            status: ""
        }
        let newStatus = item.status;
        if (newStatus == 0) {
            newReceipt.status = "Pending";
        } else if (newStatus == 1) {
            newReceipt.status = "Delivering";
        } else if (newStatus == 2) {
            newReceipt.status = "Delivered";
        } else if (newStatus == -1) {
            newReceipt.status = "Canceled";
        } else {
            newReceipt.status = "Unknown";
        }
        Receipts.push(newReceipt);
    });

    res.render('receipt/purchaseHistory', { Receipts, pageInfo })
}

exports.filter = async (req, res, next) => {
    // if (req.user == undefined) {
    //     res.redirect('/');
    //     return;
    // }

    //let id = req.user._id;

    let sorted = req.body.sorted;
    let nPerPage = req.body.nPerPage;
    let pageNumber = req.body.pageNumber;

    //console.log(`${sorted} ${nPerPage}`);

    if (nPerPage === "" || isNaN(nPerPage)) {
        nPerPage = 9;
    } else {
        nPerPage = parseInt(nPerPage);
        if (nPerPage <= 0)
            nPerPage = 9;
    }
    if (pageNumber === "" || isNaN(pageNumber)) {
        pageNumber = 1;
    } else {
        pageNumber = parseInt(pageNumber);
        if (pageNumber <= 0)
            pageNumber = 1;
    }

    //console.log(`${pageNumber}  ${nPerPage}`);
    const receiptList = await receiptModel.filter(sorted, nPerPage, pageNumber);
    const totalCount = await receiptModel.getTotalCount();

    //console.log(accountListItems);

    let totalPage = Math.ceil(totalCount / nPerPage);
    let isFirstPage = pageNumber === 1;
    let isLastPage = pageNumber === totalPage;

    let leftOverPage = 4;
    let pageList = [];

    //go backward
    for (let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i) {
        pageList.push({
            index: i,
            isCurrentPage: false
        });
        leftOverPage--;
    }

    pageList.push({
        index: pageNumber,
        isCurrentPage: true
    });

    //go forward
    for (let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i) {
        pageList.push({
            index: i,
            isCurrentPage: false
        });
        leftOverPage--;
    }

    let pageInfo = {
        totalCount,
        totalPage,
        currentPage: pageNumber,
        prevPage: pageNumber - 1,
        nextPage: pageNumber + 1,
        firstItemOfPage: pageNumber > 0 ? (pageNumber - 1) * nPerPage + 1 : 1,
        lastItemOfPage: receiptList.length < nPerPage ? (pageNumber - 1) * nPerPage + receiptList.length : pageNumber * nPerPage - 1,
        isFirstPage,
        isLastPage,
        pageList
    }

    let Receipts = [];
    receiptList.forEach(item => {
        let newReceipt = {
            _id: item._id,
            name: item.info.name,
            createdDate: item.createdDate.toString(),
            totalPrice: item.totalPrice,
            status: ""
        }
        let newStatus = item.status;
        if (newStatus == 0) {
            newReceipt.status = "Pending";
        } else if (newStatus == 1) {
            newReceipt.status = "Delivering";
        } else if (newStatus == 2) {
            newReceipt.status = "Delivered";
        } else if (newStatus == -1) {
            newReceipt.status = "Canceled";
        } else {
            newReceipt.status = "Unknown";
        }
        Receipts.push(newReceipt);
    });

    let partials = fs.readFileSync('./views/partials/receipts.hbs', { encoding: 'utf8', flag: 'r' });
    res.send({ partials, pageInfo, Receipts });
};

exports.detail = async (req, res, next) => {
    let id = req.body.id;
    let receipt = await receiptModel.findById(id);
    let info = receipt.info;

    let totalPrice = receipt.totalPrice;
    let shipping_fee = receipt.shipping_fee;
    let cartDetail = receipt.detail;
    let createdDate = receipt.createdDate;
    let status = "";
    let itemsPrice = totalPrice - shipping_fee;

    let newStatus = receipt.status;
    if (newStatus == 0) {
        status = "Pending";
    } else if (newStatus == 1) {
        status = "Delivering";
    } else if (newStatus == 2) {
        status = "Delivered";
    } else if (newStatus == -1) {
        status = "Canceled";
    } else {
        status = "Unknown";
    }
    res.render('receipt/detail/receiptDetail', {status, totalPrice, shipping_fee, cartDetail, createdDate, info, itemsPrice});
}


exports.cancel = async(req, res, next) => {
    let id = req.body.id;
    console.log(id);

    let receipt = await receiptModel.findById(id);
    //console.log(receipt);
    if (receipt.status == 2 || receipt.status == -1){
        res.send({fail: 1});
        return;
    }
    
    await receiptModel.updateStatusOne(id,-1);

    //receipt = await receiptModel.findById(id);
    //console.log(receipt);
    res.send({fail: 0});
}