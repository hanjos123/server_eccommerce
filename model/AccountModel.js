const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
        UserName: {type: String, required: true, unique: true},
        Password: {type: String, required: true},
        Name: {type: String, required: true},
        Email: {type: String, required: true},
        Phone: {type: String, required: true},
        Address: {type: String, required: true},
        Role: {type: String, required: true},
        Trash: { type: Number, default: 0 }, //Trạng thái có trong thùng rác hay không 0 là không có
        Status: { type: Number, default: 1 } //Trạng thái hiển thị trên trang web 1 là có
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Account', AccountSchema);