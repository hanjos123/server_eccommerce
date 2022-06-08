const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
var random = require('mongoose-random');
const { type } = require('express/lib/response');

const ProductSchema = new mongoose.Schema({
        Product_name:{ type: String, required: true, },
        Product_slug:{ type: String,  },
        Product_image: [{type: String, required: true }],
        Product_detail: {type: String, required:true }, 
        Size: [{
            Name_size: {type: String, required: true},
            Quantity: {type: Number, required: true},
        }],
        Category_slug:[{ type: String, required: true }],
        Price: { type: Number, required: true },
        Sale: {
            start: { type: Date },
            end: { type: Date }
        },
        PriceDiscount: { type: Number, default: 0}, //Giá khi giảm
        Trash: { type: Boolean, default: false },
        Status: { type: Boolean, default: true } //Trạng thái hiển thị trên trang web 1 là có
    }, {
        timestamps: true
    }
);

ProductSchema.plugin(random, { path: 'r' });

module.exports = mongoose.model('Product', ProductSchema);