const mongoose = require('mongoose');

const OpinionsModel = new mongoose.Schema(
    {
        Name: { type: String, required: true },
        NumberPhone: { type: String, required: true },
        Email: { type: String, required: true},
        Detail: { type: String, required: true },
        AdminToCustomer: { type: String },
        Status: {
            type: String,
            default: 'Chưa phản hồi cho khách',
            enum: [
                'Chưa phản hồi cho khách',
                'Đã phản hồi'
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Opinions', OpinionsModel);
