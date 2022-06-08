const productModel = require('../model/ProductModel');
const cartModel = require('../model/CartModel');
const orderModel = require('../model/OrderModel');
const mongoose = require('mongoose');
var random = require('mongoose-random');

const ProductController = {
    suggest: async function (req, res) {
        let slug = req.params.slug;

        let product = await productModel.findOne({Product_slug: slug});
        let suggest = await productModel.find({Pro_slug: { $in: product.Product_slug }}).limit(4);
        
        res.send(suggest);
    },

    changeStatus: async function (req, res) {
        let product = await productModel.findOne({ _id: req.params.id });
        console.log(product);
        if(product){
            let cateupdate =  await productModel.updateOne(
                { _id: req.params.id },
                { Status: !product.Status }
            ).then((result) => {
                res.json({status: 'success', info: { message: 'Chỉnh sửa thành công'} });
            }).catch((err) => {
                res.json({status: 'failed', info: { message: 'Chỉnh sửa thất bại'} });
            });;
        } else {
            res.json({status: 'failed', info: { message: 'Chỉnh sửa thất bại'} });
        }
    },

    changeTrash: async function (req, res) {
        let product = await productModel.findOne({ _id: req.params.id });
        console.log(product);
        if(product){
            let proupdate =  await productModel.updateOne(
                { _id: req.params.id },
                { Trash: !product.Trash }
            ).then((result) => {
                res.json({status: 'success', info: { message: 'Chỉnh sửa thành công'} });
            }).catch((err) => {
                res.json({status: 'failed', info: { message: 'Chỉnh sửa thất bại'} });
            });;
        } else {
            res.json({status: 'failed', info: { message: 'Chỉnh sửa thất bại'} });
        }
        
        
    },
    getOneProduct: async function(req, res){    
        let { id }= req.params;
        let product = await productModel.findById(id);
        if(product){
            res.json({status:'success',info:product})
        } else {
            res.json({status:'error',info:'Không tìm thấy sản phẩm này'})
        }
    },

    createProduct: async function (req, res) {
        let { pro_name, pro_slug, image, detail, cate, price } = req.body;
        
        try {
            if(!pro_name || !pro_slug || !image || !detail || !cate || !price){
                return res.json({status: 'error',info: { message: 'Vui lòng nhập đầy đủ thông tin'}})
            }
            let proFind = await productModel.findOne({Product_slug: pro_slug});
            if(proFind){
                return res.json({ status: 'error', info: {message: 'Đường dẫn đã tồn tại'}})
            }
            let Size = [];
            if(Array.isArray(req.body.size)){
                req.body.size.forEach(function (size, i) {
                    Size.push({ Name_size: size, Quantity: 1 });
                });
            } else {
                Size.push({ Name_size: req.body.size, Quantity: req.body.quantity });
            }
            const product = new productModel({
                Product_name: pro_name,
                Product_image: image,
                Product_detail: detail,
                Size: Size,
                Product_slug: pro_slug,
                Category_slug: cate,
                Price: price
            });
            product.save();
            return res.json({status: 'success',info:product});
            
        } catch (error) {
            res.json({ status: 'error', info: { message: 'Lỗi server' } });
        }
        
    },

    editProduct: async function (req, res) {
        let { pro_name, image, editor1, pro_slug, startSale, endSale, cate, priceSale, price } = req.body;
        try {
            if(!pro_name || !image || !editor1 || !pro_slug || !cate || !price){
                return res.json({ status: 'error', info: {message: 'Vui lòng nhập đầy đủ thông tin'}})
            }
            if(parseInt(priceSale) >= parseInt(price)){
                return res.json({ status: 'error', info: {message: 'Giá giảm không hợp lệ'}})
            }
            if(new Date(endSale) <= new Date(startSale)){
                return res.json({ status: 'error', info: {message: 'Ngày giảm giá không hợp lệ'}})
            }
            let pro = await productModel.findById(req.params.id);
            console.log(pro);
            if(pro.Product_slug != pro_slug){
                let proFind = await productModel.findOne({Product_slug: pro_slug});
                if(proFind){
                    return res.json({ status: 'error', info: {message: 'Đường dẫn đã tồn tại'}})
                }
                await orderModel.updateMany(
                    {
                        'allProduct.$.Pro_Slug': pro.Product_slug
                    }, {
                        'allProduct.$.Pro_Slug': pro_slug
                    }
                )
            }

            let Size = [];
            if(Array.isArray(req.body.size)){
                req.body.size.forEach(function (size, i) {
                    Size.push({ Name_size: size, Quantity: req.body.quantity[i] });
                });
            } else {
                Size.push({ Name_size: req.body.size, Quantity: req.body.quantity });
            }
            
            
            await productModel.updateOne({_id: req.params.id},{
                Product_name: pro_name,
                Product_image: image,
                Product_detail: editor1,
                Product_slug: pro_slug,
                Size: Size,
                Sale: {
                    start: new Date(startSale),
                    end: new Date(endSale)
                },
                Category_slug: cate,
                PriceDiscount: priceSale,
                Price: price
            }).then(res.json({status: 'success',info:{message:'Cập nhật thành công'}}));
        } catch (error) {
            console.log(error);
        }
        
    },

    duplicateProduct: async function(req, res){
        let id = req.params.id;
        let product = await productModel.findById(id);
        product._id = mongoose.Types.ObjectId();
        product.Product_slug = product.Product_slug + 'duplicated';
        product.isNew = true;
        product.save().then(()=>{
            res.json(product);      
        })
    },

    getNewProduct: async function (req, res) {
        let listProduct = await productModel
            .find({Status: 1})
            .sort({ createdAt: 'desc' })
            .limit(6);
        res.json(listProduct);
    },

    getSaleProduct: async function (req, res) {
        let listProduct = await productModel.find(
            {
                'Sale.start': {
                    $lt: new Date(),
                },
                'Sale.end': {
                    $gt: new Date()
                },
                Status: 1
                
            }).limit(6);
        res.json(listProduct);
    },

    getAllSaleProduct: async function(req, res){
        let page = req.body.page || 1;
        let perPage = req.body.perPage || 9;
        let listProduct = await productModel.find(
            {
                'Sale.start': {
                    $lt: new Date(),
                },
                'Sale.end': {
                    $gt: new Date()
                },
                Status: 1,
                Trash: false
                
            })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({ createdAt: 'asc' });
        res.json(listProduct);
    },

    getTrashProduct: async function (req, res) {
        let listProduct = await productModel.find({Trash: true});
        res.json(listProduct);
    },

    
    getOneProducyBySlug: async function (req, res) {
        const slug = req.body.slug;
        let product = await productModel.findOne({ Product_slug: slug, Status: 1 });
        if (product) {
            res.json({
                status: 'success',
                info: product
            });
        } else {
            res.json({
                status: 'error',
                info: 'Không thể tìm thấy sản phẩm này'
            });
        }
    },

    getAllProducyByCategorySlug: async function (req, res) {
        const slug = req.body.slug;
        let page = req.body.page || 1;
        let perPage = req.body.perPage || 9;
        let pro = [];
        if (slug) {
            pro = await productModel.find({ Category_slug: slug, Status: 1 }).skip(perPage * page - perPage).limit(perPage);
        } else {
            pro = await productModel.find().skip(perPage * page - perPage).limit(perPage);
        }
        if (pro) {
            res.json({
                status: 'success',
                info: pro
            });
        } else {
            res.json({
                status: 'error',
                info: 'Không thể tìm thấy sản phẩm này'
            });
        }
    },

    findProduct: async function (req, res) {
        const str = req.body.str;
        let product = await productModel.find({
            Product_name: { $regex: str, $options: 'i' },
            Status: 1
        });
        console.log(product);
        if (product) {
            res.json({
                status: 'success',
                info: product
            });
        } else {
            res.json({
                status: 'error',
                info: 'Không tìm thấy sản phẩm'
            });
        }
    },

    paginationProduct: async function (req, res) {
        let perPage = req.body.perPage || 10;
        let page = req.body.page || 1;

        let totalProduct = await productModel.count({Trash: false});
        let totalTrashProduct = await productModel.count({Trash: true});

        let products = await productModel
            .find({Trash: false})
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({ createdAt: 'asc' });
        res.json({products, totalProduct, totalTrashProduct});
    },

    deleteProduct: async function (req, res){
        let { id } = req.params;
        let product = await productModel.findByIdAndDelete(id);
        if(product){
            await cartModel.update(
                {},
                { $pull: { Inventory: { Pro_slug: product.Product_slug } } }
            );
            return res.json({ status: 'success', info: 'Xóa thành công' });
        } else {
            return res.json({ status: 'failed', info: { message: 'Không tìm thấy sản phẩm' } })
        }
    }
};

module.exports = ProductController;
