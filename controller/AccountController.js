const accountModel = require('../model/AccountModel');
const cartModel = require('../model/CartModel');
const tokenModel = require('../model/TokenModel');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('B4c0//', salt);
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const dotenv = require('dotenv');
const mail = require('../helper/SendMail');
const { isBuffer } = require('util');
dotenv.config();

const AccountController = {
    //Info
    login: async function (req, res) {
        try {
            var user = await accountModel.findOne({
                UserName: req.body.username,
                Role: 'customer'
            });
            let validPassword = await bcrypt.compare(
                req.body.password,
                user.Password
            );

            if(user.Status == 0){
                return res.json({
                    status: 'error',
                    info: 'Tài khoản của bạn đang bị tạm khóa'
                });
            }

            if (!user || !validPassword)
                return res.json({
                    status: 'error',
                    info: 'Bạn đã nhập sai tài khoản hoặc mật khẩu'
                });

            if (user && validPassword) {
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        name: user.Name,
                        role: user.Role
                    },
                    process.env.JWT_ACCESS_KEY
                );
                res.json({
                    status: 'success',
                    info: accessToken
                });
            }
        } catch (error) {
            return res.json(error);
        }
    },

    loginadmin: async function (req, res) {
        const { username, password } = req.body;
        try {
            var user = await accountModel.findOne({
                UserName: username
            });

            let validPassword = await bcrypt.compare(password, user.Password);

            if (!user || !validPassword) {
                return res.json({
                    status: 'error',
                    info: 'Bạn đã nhập sai tài khoản hoặc mật khẩu'
                });
            }

            if (user.Role != 'admin') {
                return res.json({
                    status: 'error',
                    info: 'Bạn không có quyền truy cập'
                });
            }

            if (user && validPassword) {
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        name: user.Name
                    },
                    process.env.JWT_ACCESS_KEY
                );
                return res.json({
                    status: 'success',
                    info: accessToken
                });
            }
        } catch (error) {
            return res.json(error);
        }
    },

    register: async function (req, res) {
        let { UserName, Password, Name, Email, Phone, Address } = req.body;

        try {
            console.log(req.body);
            if (!UserName || !Password || !Name || !Email || !Phone || !Address)
                return res.json({
                    status: 'error',
                    info: 'Vui lòng nhập đầy đủ thông tin'
                });

            var user = await accountModel.findOne({
                UserName: UserName
            });

            if (user)
                return res.json({
                    status: 'error',
                    info: 'Tài khoản này đã được sử dụng'
                });
            bcrypt.hash(Password, salt, async function (err, hash) {
                const account = new accountModel({
                    UserName: UserName,
                    Password: hash,
                    Name: Name,
                    Email: Email,
                    Phone: Phone,
                    Address: Address,
                    Role: 'customer'
                });
                await account.save();
                let cart = new cartModel({
                    UserID: account._id,
                    Inventory: []
                });
                await cart.save();
                res.json({
                    status: 'success',
                    info: account
                });
            });
        } catch (error) {
            return res.json(error);
        }
    },

    edit: async function(req, res){
        let { Name, Phone, Address, Email } = req.body;
        let id = req.params.id;
        if(!Name || !Phone || !Address || !Email){
            res.json({
                status: 'error',
                info: { message: 'Vui lòng nhập đầy đủ thông tin' }
            });
        }
        await accountModel.updateOne({ _id: id}, req.body );
        res.json({
            status: 'success',
            info: { message: 'Chỉnh sửa thành công'}
        });
    },

    getOneAccount: async function (req, res) {
        const id = req.body.id;
        let user = await accountModel.findById(id);
        if (user) {
            const { Password, ...others } = user._doc;
            res.json({
                status: 'success',
                info: others
            });
        } else {
            res.json({
                status: 'error',
                info: 'Tài khoản không tồn tại'
            });
        }
    },

    getAllAccount: async function (req, res) {
        let user = await accountModel.find();
        if (user) {
            res.json({
                status: 'success',
                info: user
            });
        }
    },

    changepassword: async function (req, res) {
        console.log(req.body);
        let username = req.body.username;
        let user = await accountModel.findOne({UserName: username});
        let email = user.Email;
        if(user == null ){
            return res.json({status: 'error', info: {message: 'Tài khoản không tồn tại'}})
        }
        let tokenPassword = crypto.randomBytes(32).toString("hex");
        let token = new tokenModel({
            Email: user.Email,
            Token: tokenPassword
        })
        token.save();
        html = '<a href="http://localhost:3000/account/password-reset/'+ email + '/' + tokenPassword +'" style="color:#4795df;font-size:14px;font-weight:400;line-height:120%" target="_blank">Click here</a>';
        await mail.sendChangePassword(html ,email);

        return res.json({status: 'success', info: {message: 'Liên kết đổi mật khẩu đã được gửi đến email tài khoản'}})
    },

    dochangepassword: async function(req, res){
        let { email, token } = req.params;
        console.log(req.body);
        if(!email || !token){
            return res.json({status: 'error', info: {message: 'Vui lòng nhập đầy đủ thông tin'}})
        }
        let tokenPassword = await tokenModel.findOne(req.body);
        if(tokenPassword != null){
            let password = req.body.password;

            bcrypt.hash(password, salt, async function (err, hash) {
                await accountModel.updateOne({Password: hash});
            });
            

            await tokenModel.deleteMany({Email: email});
            res.json({status: 'success', info: {message: 'Đổi mật khẩu thành công'}})
        } else {
            res.json({status: 'error'});
        }
    },

    checkToken: async function(req, res){
        let { Email, Token } = req.body;
        if(!Email || !Token){
            return res.json({status: 'error', info: {message: 'Vui lòng nhập đầy đủ thông tin'}})
        }
        let tokenPassword = await tokenModel.findOne(req.body);
        if(tokenPassword){
            res.json({status: 'success'})
        } else {
            res.json({status: 'error'});
        }
    },

    delete: async function(req, res){
        let id = req.params.id;
        let account = await accountModel.findById(id);
        if(!account){
            return res.json({status: 'error', info: {message: 'Tài khoản không tồn tại'}});
        }
        await accountModel.deleteOne({ _id: id });
        return res.json({status: 'success', info: {message: 'Xóa thành công'}});
    },

    changeStatus: async function(req, res){
        let id = req.params.id;
        let account = await accountModel.findById(id);
        if(!account){
            return res.json({status: 'error', info: {message: 'Tài khoản không tồn tại'}});
        }
        await accountModel.updateOne({ _id: id }, {Status: !account.Status});
        return res.json({status: 'success', info: {message: 'Sửa thành công'}});
    }
};

module.exports = AccountController;
