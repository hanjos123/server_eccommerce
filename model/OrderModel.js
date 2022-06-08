const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        allProduct: [
            {
                Pro_slug: { type: String, required: true },
                Size: { type: String, required: true },
                Quantity: { type: Number, required: true }
            }
        ],
        UserID: { type: String, required: true },
        Name: { type: String, required: true },
        Address: { type: String, required: true },
        NumberPhone: { type: String, required: true },
        Email: { type: String, required: true},
        Total: { type: Number, required: true },
        PaymentMethod: { type: String, required: true},
        Status: {
            type: String,
            default: 'Chưa xác nhận',
            enum: [
                'Chưa xác nhận',
                'Đang soạn đơn',
                'Đang vận chuyển',
                'Đã thanh toán',
                'Hủy đơn hàng'
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', OrderSchema);
