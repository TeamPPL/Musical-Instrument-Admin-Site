
const fs = require("fs");
const bcrypt = require('bcrypt');

const accountModel = require('../models/accountModel');
const adminAccountsModel = require('../models/adminAccountsModel');

exports.index = async (req, res, next) => {
    let pageNumber = 1;
    let nPerPage = 5;
    const accountListItems = await accountModel.getProductsAtPage(pageNumber, nPerPage);
    const totalCount = await accountModel.getTotalCount();

    let totalPage = Math.ceil(totalCount / nPerPage);
    let isFirstPage = pageNumber === 1;
    let isLastPage = pageNumber === totalPage;

    let leftOverPage = 4;
    let pageList = [];

    //go backward
    for(let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i)
    {
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
    for(let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i)
    {
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
        lastItemOfPage: accountListItems.length < nPerPage ? (pageNumber - 1) * nPerPage +  accountListItems.length :  pageNumber * nPerPage - 1,
        isFirstPage,
        isLastPage,
        pageList
    }
    //console.dir(accountListItems);
    res.render('user/accounts', { accountListItems, pageInfo })
}

exports.filter = async (req, res, next) => {
    let sorted = req.body.sorted;
    let nPerPage = req.body.nPerPage;
    let typeAccount = req.body.typeAccount;
    let pageNumber = req.body.pageNumber;

    console.log(`${sorted} ${nPerPage}`);

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

    let accountListItems = null;
    let totalCount = null;
    let isAdminAccounts = false;
    if (typeAccount === "user")
    {
        accountListItems = await accountModel.filter(sorted, nPerPage, pageNumber);
        totalCount = await accountModel.getTotalCount();
    }
    else if (typeAccount === "admin") 
    {
        isAdminAccounts = true;
        accountListItems = await adminAccountsModel.filter(sorted, nPerPage, pageNumber);
        totalCount = await adminAccountsModel.getTotalCount();
    }

    //console.log(accountListItems);

    let totalPage = Math.ceil(totalCount / nPerPage);
    let isFirstPage = pageNumber === 1;
    let isLastPage = pageNumber === totalPage;

    let leftOverPage = 4;
    let pageList = [];

    //go backward
    for(let i = pageNumber - 1; i >= pageNumber - (leftOverPage / 2) && i > 0; --i)
    {
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
    for(let i = pageNumber + 1; i <= pageNumber + (leftOverPage / 2) && i <= totalPage; ++i)
    {
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
        lastItemOfPage: accountListItems.length < nPerPage ? (pageNumber - 1) * nPerPage +  accountListItems.length :  pageNumber * nPerPage - 1,
        isFirstPage,
        isLastPage,
        pageList,
    }

    for(let i = 0; i< accountListItems.length; ++i)
    {
        accountListItems[i].isAdminAccount = isAdminAccounts;
    }

    console.log(pageInfo);
    res.send({ pageInfo, accountListItems });
};

exports.lock = async (req, res, next) => {
    let id = req.body.id;
    console.log(id);
    const result = await accountModel.lockAccount(id);

    //console.log(result.deletedCount);

    if (!result)
    {
        req.flash("error", "Can't lock account.");
        res.send({status : 0});
    }
    else
    {
        req.flash("message-info", "Account locked.");
        res.send({status : 1});
    }
    //next();
}

exports.unlock = async (req, res, next) => {
    let id = req.body.id;
    console.log(id);
    const result = await accountModel.unlockAccount(id);

    console.log(result.deletedCount);

    if (!result)
    {
        req.flash("error", "Can't unlock account.");
        res.send({status : 0});
    }
    else
    {
        req.flash("message-info", "Account unlocked.");
        res.send({status : 1});
    }
    next();
}

exports.getUserDetail = async (req, res, next) => {
    let id = req.params.id;
    console.log(id);
    const account = await accountModel.findUserById(id);

    if (!account)
    {
        req.flash("error", "User is not available.");
        res.redirect(req.get('referer'));
    }
    
    res.render('user/userAccountInfo', {account});
}