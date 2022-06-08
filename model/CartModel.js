const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        UserID: { type: String, required: true },
        Inventory: [
            {
                Pro_slug: { type: String, required: false },
                Size: { type: String, required: false },
                Quantity: { type: Number, required: false }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Cart', CartSchema);