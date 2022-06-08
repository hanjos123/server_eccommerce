const fs = require('fs');
const imageModel = require('../model/ImageModel');

const SliderController = {
    getAllImage: async function (req, res) {
        try {
            let Images = await imageModel.find();
            if (Images) {
                return res.json(Images);
            }
        } catch (err) {
            console.log(err);
        }
    },

    uploadImage: async function(req, res){
        console.log(req.files);

        try {
            for(let i = 0; i < req.files.length; i++){
                let newImage = new imageModel({
                    iFileName: req.files[i].filename,
                    iType: 'customs'
                });
                await newImage.save();
            }
            let Images = await imageModel.find();
            return res.json({Images});
        } catch (err) {
            console.log(err);
        }
    },

    deleteImage: async function (req, res) {
        let { id } = req.params;
        try {
            let deletedSlideImage = await imageModel.findById(id);
            const filePath = `../server/public/uploads/${deletedSlideImage.iFileName}`;

            let deleteImage = await imageModel.findByIdAndDelete(id);
            if (deleteImage) {
                // Xóa ảnh slider từ thư mục Public/uploads/sliders
                fs.unlink(filePath, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            let Images = await imageModel.find({});
            return res.json({ Images });
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = SliderController;
