const cartModel = require('../model/CartModel');
const productModel = require('../model/ProductModel');

const CartController = {
    addToCart: async function (req, res) {
        console.log(req.body);
        let { uId, slug, quantity, size } = req.body;

        let option = await cartModel.findOne({
            UserID: uId,
            'Inventory.Product_slug': slug,
            'Inventory.Size': size
        });
        let index = -1;
        if (option) {
            index = option.Inventory.findIndex(
                x => x.Size === size && x.Pro_slug === slug
            );
        }

        if (index === -1) {
            // Thêm mới vào giỏ hàng khi size và sản phẩm đã có trong giỏ hàng của uId
            await cartModel
                .updateOne(
                    { UserID: uId },
                    {
                        $push: {
                            Inventory: {
                                Pro_slug: slug,
                                Size: size,
                                Quantity: quantity
                            }
                        }
                    }
                )
                .then(() => {
                    console.log('add done');
                });
        } else {
            //Ngược lại tăng số lượng lên cho sản phẩm và size được tìm thấy trong giỏ hàng của uId
            await cartModel.updateOne(
                {
                    'Inventory._id': option.Inventory[index]._id
                },
                {
                    $set: {
                        'Inventory.$.Quantity':
                            parseInt(option.Inventory[index].Quantity) +
                            parseInt(quantity)
                    }
                }
            );
        }

        res.json({ status: 'success', info: 'Thêm thành công' });
    },

    viewCart: async function (req, res) {
        let uId = req.body.uId;

        let products = [];
        let cart = await cartModel.findOne({ UserID: uId });
        if (cart && cart.Inventory != null) {
            for (i = 0; i < cart.Inventory.length; i++) {
                let pro = await productModel.findOne({
                    Product_slug: cart.Inventory[i].Pro_slug
                });
                products.push(pro);
            }
        }

        res.json({ status: 'success', info: { cart, products } });
    },

    deleteCart: async function (req, res) {
        let { idIndexPro } = req.body;
        await cartModel.updateOne(
            {},
            { $pull: { Inventory: { _id: idIndexPro } } }
        );
        res.json({ status: 'success', info: 'Xóa thành công' });
    },

    updatesize: async function (req, res) {
        let id = req.body.id;
        let size = req.body.size;
        await cartModel.updateOne(
            { 'Inventory._id': id },
            {
                $set: {
                    'Inventory.$.Size': size
                }
            }
        );
        res.json({ status: 'success' });
    },

    updatequantity: async function (req, res) {
        let { id, method } = req.body;
        if (method == 'increase') {
            await cartModel.updateOne(
                { 'Inventory._id': id },
                {
                    $inc: {
                        'Inventory.$.Quantity': 1
                    }
                }
            );
        } else {
            await cartModel.updateOne(
                { 'Inventory._id': id },
                {
                    $inc: {
                        'Inventory.$.Quantity': -1
                    }
                }
            );
        }
        res.json({ status: 'success' });
    }
};

module.exports = CartController;
