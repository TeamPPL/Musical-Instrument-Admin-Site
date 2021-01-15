
const fs = require("fs");
const bcrypt = require('bcrypt');

const adminAccountModel = require('../models/adminAccountsModel');

const saltRounds = 10;

exports.login = (req, res, next) => {
    res.render('admin/login');
};

exports.info = async (req, res, next) => {

    let username = req.user.username;
    let account = await adminAccountModel.findAdminByUsername(username);
  
    res.render('admin/personalInfo', {account});
}

exports.changePassword = async (req, res, next) => {
  if (req.user.isSuperAdmin)
  {
    req.flash("info", "Super admin can't change their info from here.");
    res.redirect(req.get("referer"));
  }

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const comfirmNewPassword = req.body.reNewPassword;
    
  
    const username = req.user.username;
    let account = await adminAccountModel.findAdminByUsername(username);
  
    if (account)
    {
      if (!bcrypt.compareSync(currentPassword, account.password))
      {
        req.flash("error", "Current password doesn't match!");
        res.redirect(req.get('referer'));
      }
      
      //Check is password and re-password are the same?
      if (newPassword != comfirmNewPassword)
      {
        req.flash("error", "New Password and Comfirm New Password must be the same!");
        res.redirect(req.get('referer'));
      }
          
    }
    //Hash password and save to DB.
    let hash = bcrypt.hashSync(newPassword, saltRounds);
    let accountReturn = await adminAccountModel.updatePassword({username: username}, hash);

    if (accountReturn)
    {
      //Change pass successfull.
  
      req.flash("message-info", "Password changed successfully!");
      res.redirect(req.get('referer'));
    }
    else {
      //Error.
      req.flash("error", "Password changed failed!");
      res.redirect(req.get('referer'));
    }
  
  }

  exports.updateAccountInfo = async (req, res, next) => {
    if (req.user.isSuperAdmin)
  {
    req.flash("info", "Super admin can't change their info from here.");
    res.redirect(req.get("referer"));
  }

    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    if (files) {
      const name = fields.name;
      const email = fields.email;
      const username = fields.username;
      const phone = fields.phone;

      //Check available username
      let isAvailableUsernameAccount = await adminAccountModel.findAdminByUsername(username);

      if (isAvailableUsernameAccount && username !== req.user.username)
      {
        req.flash("error", "Username already exist!");
        res.redirect(req.get('referer'));
      }

      //Upload image
      let avatar;
      let temp_path = files.cover.path;
      if (files.cover.size === 0) {
          avatar = 0;
      } else {
        let upload = await adminAccountModel.updateAvatar(temp_path);
        avatar = upload.secure_url;
      }
      
    
      let updatedAccount = {
          name,
          //email,
          username,
          phone,
          "modifiedDate": new Date()
      };
      if (avatar !== 0) {
        updatedAccount.avatar = avatar;
      }

      try {
        let result = await adminAccountModel.updateAAccount(updatedAccount);
        //var message="ADDED SUCCESSFULLY";
        //res.render('products/addproduct',{productDetail,message});
        console.log(result);
        res.redirect('/user');
      }
      catch(err){
        
      }  
    }
    await console.log(upload.secure_url);
  });

}

exports.getNewAdmin = (req, res, next) => {
    res.render('admin/createAdminAccount');
};

exports.createNewAccount = async (req, res, next) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const phone = req.body.phone;
    const email = req.body.email;

    let account = await adminAccountModel.findAdminByUsername(username);

    if (account) 
    {
        //Account already exist, checked with ajax but still recheck here
        req.flash("error", "Username already exist!");
        res.send({ reload: true });
    } else {
        //Chua co username nay
        let hash = bcrypt.hashSync(password, saltRounds);
        let accountInfos = {
            "username": username,
            "password": hash,
            "name": name,
            "phone": phone,
            "email": email,
            "createdDate": new Date(),
            "modifiedDate": new Date(),
            "isLocked": false,
            "isAdminAccount": true,
        };

        adminAccountModel.insertOne(accountInfos);

        req.flash('message-info', 'New admin account created.');
        res.redirect('/admin');
    }
}

exports.checkSignupData = async (req, res, next) => {
    let email = req.body.email;
    let username = req.body.username;
  
    //Return status: -1 - empty input, 0 - account already exist, 1 - free to use email/username
    console.log(email);
    if (email === ""){
      res.send({status: -1});
    }
  
    if (username === ""){
      res.send({status: -1});
    }
  
    if (email !== "" && username !== "") {
      let usernameList = await adminAccountModel.findAdminByUsername(username);
      let isSuperAdmin = await adminAccountModel.checkSuperAdmin(username);

      if (isSuperAdmin)
      {
        res.send({status: 0});
      }

      if (usernameList)
      {
        res.send({status: 0});
      }
  
      let emailList = await adminAccountModel.findAdminByEmail(email);
  
      if (emailList)
      {
        res.send({status: 0});
      }
    }
  
    res.send({status: 1});
}

exports.logout = async (req, res, next) => {
  req.logout();
  return res.redirect(req.get('referer'));
}

exports.lock = async (req, res, next) => {
  let id = req.body.id;
  console.log(id);
  if (!req.user.isSuperAdmin)
  {
    req.flash("message-warning", "Only super admin can lock/unlock admin's accounts!")
    return res.send({status: 0});
  }
  const result = await adminAccountModel.lockAccount(id);

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
  if (!req.user.isSuperAdmin)
  {
    req.flash("message-warning", "Only super admin can lock/unlock admin's accounts!")
    return res.send({status: 0});
  }
  const result = await adminAccountModel.unlockAccount(id);


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
  const account = await adminAccountModel.findAdminById(id);

  if (!account)
  {
      req.flash("error", "User is not available.");
      res.redirect(req.get('referer'));
  }
  
  res.render('user/userAccountInfo', {account});
}