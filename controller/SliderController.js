const fs = require('fs');
const imageModel = require('../model/ImageModel');

const SliderController = {
    getSlider: async function (req, res) {
        try {
            let Images = await imageModel.find({ iType: 'sliders' });
            if (Images) {
                return res.json(Images);
            }
        } catch (err) {
            console.log(err);
        }
    },

    uploadSlider: async function (req, res) {
        try {
            let newImageSlider = new imageModel({
                iFileName: req.file.filename,
                iType: 'sliders'
            });
            let save = await newImageSlider.save();
            let Images = await imageModel.find({iType: 'sliders'});
            if (save) {
                return res.json({
                    status: 'success',
                    message: 'Ảnh đã được thêm thành công',
                    info: Images
                });
            }
        } catch (err) {
            console.log(err);
        }
    },

    deleteSlider: async function (req, res) {
        let { id } = req.body;
        try {
            let deletedSlideImage = await imageModel.findById(id);
            const filePath = `../server/public/uploads/sliders/${deletedSlideImage.sliderImage}`;

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
