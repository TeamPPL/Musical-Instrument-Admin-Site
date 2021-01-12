
const fs = require("fs");
const bcrypt = require('bcrypt');

const accountModel = require('../models/accountModel');

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

    //console.log(`${pageNumber}  ${nPerPage}`);
    const accountListItems = await accountModel.filter(sorted, nPerPage, pageNumber);
    const totalCount = await accountModel.getTotalCount();

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
        pageList
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
        //res.redirect(req.get('referer'));
    }
    else
    {
        req.flash("message-info", "Account locked.");
        //res.redirect(req.get('referer'));
    }
    next();
}

exports.unlock = async (req, res, next) => {
    let id = req.body.id;
    console.log(id);
    const result = await accountModel.unlockAccount(id);

    console.log(result.deletedCount);

    if (!result)
    {
        req.flash("error", "Can't unlock account.");
        //res.redirect(req.get('referer'));
    }
    else
    {
        req.flash("message-info", "Account unlocked.");
        //res.redirect(req.get('referer'));
    }
    next();
}