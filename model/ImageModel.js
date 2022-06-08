const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
    {
        iFileName: { type: String, required: true },
        iType: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Image', ImageSchema);