const cartModel = require('../model/CartModel');
const orderModel = require('../model/OrderModel');
const productModel = require('../model/ProductModel');
const mail = require('../helper/SendMail');

const orderController = {
    newest: async function(req, res){
        let order = await orderModel.find().sort({createdAt: -1}).limit(6);
        res.json(order);
    },

    changeStatus: async function(req, res){
        let id = req.params.id;
        await orderModel.updateOne({_id: id},{
            Status: req.body.status
        })
        res.json({status: 'success', info: { message: 'Chỉnh sửa thành công' } })
    },

    checkOut: async function (req, res) {
        console.log(req.body);
        const { id, name, email, address, numberphone, paymentmethods } = req.body;
        try {
            let sum = 0;
            let products = [];
            let cart = await cartModel.findOne({ UserID: id });
            if (cart && cart.Inventory != null) {
                for (i = 0; i < cart.Inventory.length; i++) {
                    let pro = await productModel.findOne({
                        Product_slug: cart.Inventory[i].Pro_slug
                    });
                    console.log(pro.Sale);
                    if(pro.Sale !== undefined){
                        if(new Date(pro.Sale.start) < new Date() && new Date() < new Date(pro.Sale.end)){
                            sum += cart.Inventory[i].Quantity * pro.PriceDiscount;
                        } else {
                            sum += cart.Inventory[i].Quantity * pro.Price;
                        }
                    } else {
                        sum += cart.Inventory[i].Quantity * pro.Price;
                    }
                    products.push(pro);
                }
            }
            const order = new orderModel({
                allProduct: cart.Inventory,
                UserID: id,
                Name: name,
                Address: address,
                NumberPhone: numberphone,
                Email: email,
                Total: sum,
                PaymentMethod: paymentmethods
            });
            
            order.save();

            //clear giỏ hàng
            await cartModel.updateOne({ UserID: id },{
                $set: { Inventory: [] }
            })
            if(paymentmethods == 'Tiền mặt'){
                await mail.sendmail(
                    cart,
                    products,
                    name,
                    email,
                    address,
                    numberphone,
                    order._id
                );
            }

            

            let content = [];
            content.push({
                view: 'pages/confirmation',
                data: { cart, products, email }
            });

            res.json({ status: 'success' });
        } catch (error) {
            res.json(error);
        }
    },

    getOneByID: async function (req, res){
        let { id } = req.params;
        let order = await orderModel.findById(id);
        let productorder = [];
        for (i = 0; i < order.allProduct.length; i++) {
            let pro = await productModel.findOne({
                Product_slug: order.allProduct[i].Pro_slug
            });
            productorder.push(pro);
        }
        res.json({ status: 'success', info: { productorder, order }})
    },

    getOneByUserID: async function (req, res){
        let { UserID } = req.body;
        let order = await orderModel.find({ UserID: UserID});
        res.json({ status: 'success', info: order})
    },

    confirmOrder: async function (req, res){
        let id = req.params.id;
        let order = await orderModel.findById(id);
        if(order.Status === 'Chưa xác nhận'){
            await orderModel.findByIdAndUpdate(id, { Status: 'Đang soạn đơn' });
        }
        res.json({ status: 'success', info: { message: 'Đã thay đổi trạng thái'}})
    },

    listOrder: async function(req, res){
        let order = await orderModel.find({}).sort({ createdAt: 'desc' });
        res.json({ status: 'success', info: order });
    },

    totalMonth: async function(req, res){
        let dateStart = new Date(req.body.dateStart);
        let dateEnd = new Date(req.body.dateEnd);
        dateEnd.setDate(dateEnd.getDate() + 1);
        let total = await orderModel.aggregate([
            {
                $match: {
                    "createdAt": {
                        $gte: dateStart,
                        $lte: dateEnd
                    },
                    "Status": "Đã thanh toán"
                }
            },
            {
                $group:
                {
                    _id: {
                        $dateToString: { format: "%Y/%m/%d", date: "$createdAt" }
                    }, 
                    Total:{$sum:"$Total"}
                }
            }
        ])
        res.json(total);
    }
    
};

module.exports = orderController;
