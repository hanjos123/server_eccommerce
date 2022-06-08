const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const NewsSchema = new mongoose.Schema(
    {
        nTitle: { type: String, required: true },
        nSlug: { type: String, slug: "nTitle" },
        nAvatar: { type: String, required: true },
        nBody: { type: String, required: true},
        nCategory: [{ type: String, required: true }],
        nAuthor: { type: String, required: true, default: 'Admin'},
        nStatus: { type: Boolean, required: true},
    },
    {
        timestamps: true
    }
);

mongoose.plugin(slug);

module.exports = mongoose.model('News', NewsSchema);
