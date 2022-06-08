const mongoose = require('mongoose');

const TokensSchema = new mongoose.Schema(
    {
        Email: { type: String, required: true },
        Token: { type: String, require: true },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tokens', TokensSchema);
