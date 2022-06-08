const mongoose = require('mongoose');

const PagesSchema = new mongoose.Schema(
    {
        pTitle: { type: String, required: true },
        pSlug: { type: String, require: true },
        pBody: { type: String, required: true},
        pStatus: { type: Boolean, required: true, default: true },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Pages', PagesSchema);
