const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const CategorySchema = new mongoose.Schema(
    {
        cName: { type: String, required: true },
        cUrl: { type: String, require: true },
        cParentId: { type: String, default: '0' },
        cType: { type: String, default: 'custom' },
        cAlone: { type: Boolean, default: true },
        cOrder: { type: Number, default: 0 },
        Status: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
);

mongoose.plugin(slug);

module.exports = mongoose.model('Category', CategorySchema);