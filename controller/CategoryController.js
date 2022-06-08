const categoryModel = require('../model/CategoryModel');
var slug = require('slug');

const CategoryController = {
    edit: async function(req, res){
        console.log(req.body);
        let cate = await categoryModel.updateOne({_id: req.params.id}, req.body);
        res.json({status: 'success', info: { message: 'Sửa thành công'} });
    },

    getAllCategory: async function (req, res) {
        let cateParent0 = await categoryModel.find({cParentId: 0}).sort({ cOrder: 'asc' });
        let cateParentId = await categoryModel.find({cParentId: {$ne: 0}}).sort({ cOrder: 'asc' });
        res.json({listCategory: {cateParent0, cateParentId}});
    },

    getOneCategory: async function (req, res) {
        let category = await categoryModel.findById(req.body.id);
        res.json(category);
    },

    getShowCategory: async function (req, res) {
        let listCategory = await categoryModel
            .find({ Status: 1 })
            .sort({ cOrder: 'asc' });
        res.json(listCategory);
    },

    changeStatus: async function (req, res) {
        let category = await categoryModel.findOne({ _id: req.params.id });
        if(category){
            let cateupdate =  await categoryModel.updateOne(
                { _id: req.params.id },
                { Status: !category.Status }
            ).then((result) => {
                res.json({status: 'success', info: { message: 'Chỉnh sửa thành công'} });
            }).catch((err) => {
                res.json({status: 'failed', info: { message: 'Chỉnh sửa thất bại'} });
            });;
        } else {
            res.json({status: 'failed', info: { message: 'Chỉnh sửa thất bại'} });
        }
        
        
    },

    createCategory: async function (req, res) {
        let { cName, cUrl, cParentId } = req.body;
        let category = new categoryModel({
            cName,
            cUrl,
            cParentId
        });
        if (cParentId != 0) {
            await categoryModel.updateOne(
                { _id: cParentId },
                { cAlone: false }
            );
            let count = await categoryModel
                .find({ cParentId: cParentId })
                .count();
            category.cOrder = count;
        } else {
            let count = await categoryModel.find({ cParentId: 0 }).count();
            category.cOrder = count;
        }
        category.save();
        res.json(category);
    },

    deleteCategory: async function (req, res) {
        let { id } = req.body;
        let category = await categoryModel.findByIdAndDelete(id);
        await categoryModel.deleteMany({ cParentId: id });

        //update vị trí
        if(category.cParentId == 0){
            let listcategory = await categoryModel.find({cParentId: '0'}).sort({cOrder: 'asc'});
            listcategory.forEach(async (cate,i) => {
                await categoryModel.updateOne({_id: cate._id},{cOrder: i});
            });
        } else {
            let listcategory = await categoryModel.find({cParentId: category.cParentId}).sort({cOrder: 'asc'});
            listcategory.forEach(async (cate,i) => {
                await categoryModel.updateOne({_id: cate._id},{cOrder: i});
            });
        }

        //update trạng thái không chứa danh mục con
        if (category.cParentId != 0) {
            let count = await categoryModel.count({ cParentId: category.cParentId });
            console.log(count);
            if (count == 0) {
                await categoryModel.updateOne(
                    { _id: category.cParentId },
                    { cAlone: true }
                );
            }
        }

        let listCategory = await categoryModel.find().sort({ cOrder: 'asc' });
        res.json(listCategory.data);
    },

    changePosition: async function (req, res) {
        let { id, method } = req.body;
        console.log(req.body);
        let category = await categoryModel.findById(id);
        if (method == 'up') {
            if (category.cOrder != 0) {
                if (category.cParentId == 0) {
                    let cateChangedPosition = await categoryModel.findOne({
                        cOrder: category.cOrder - 1
                    });
                    console.log(cateChangedPosition);
                    await categoryModel.updateOne(
                        { _id: id, cParentId: 0 },
                        { cOrder: parseInt(category.cOrder - 1) }
                    );
                    await categoryModel.updateOne(
                        { _id: cateChangedPosition._id },
                        { cOrder: category.cOrder }
                    );
                } else {
                    let cateChangedPosition = await categoryModel.findOne({
                        cOrder: category.cOrder - 1,
                        cParentId: category.cParentId
                    });
                    console.log(cateChangedPosition);
                    await categoryModel.updateOne(
                        { _id: id },
                        { cOrder: category.cOrder - 1 }
                    );
                    await categoryModel.updateOne(
                        { _id: cateChangedPosition._id },
                        { cOrder: category.cOrder }
                    );
                }
            }
        } else if (method == 'down') {
            if (category.cParentId == 0) {
                let lastIndexParentId0 = await categoryModel.count({
                    cParentId: 0
                });
                if (category.cOrder != lastIndexParentId0) {
                    let cateChangedPosition = await categoryModel.findOne({
                        cOrder: category.cOrder + 1
                    });
                    console.log(cateChangedPosition);
                    await categoryModel.updateOne(
                        { _id: id, cParentId: 0 },
                        { cOrder: parseInt(category.cOrder + 1) }
                    );
                    await categoryModel.updateOne(
                        { _id: cateChangedPosition._id },
                        { cOrder: category.cOrder }
                    );
                }
            } else {
                let lastIndexParentId = await categoryModel.count({
                    cParentId: category.cParentId
                });
                if (category.cOrder != lastIndexParentId) {
                    let cateChangedPosition = await categoryModel.findOne({
                        cOrder: category.cOrder + 1,
                        cParentId: category.cParentId
                    });
                    console.log(cateChangedPosition);
                    await categoryModel.updateOne(
                        { _id: id },
                        { cOrder: category.cOrder + 1 }
                    );
                    await categoryModel.updateOne(
                        { _id: cateChangedPosition._id },
                        { cOrder: category.cOrder }
                    );
                }
            }
        }
        res.end();
    },

    find: async function(req, res){
        const str = req.body.str;
        let category = await categoryModel.find({
            cName: { $regex: str, $options: 'i' }
        });
        if (category.length != 0) {
            res.json({
                status: 'success',
                info: category
            });
        } else {
            res.json({
                status: 'failed',
                info: 'Không tìm thấy sản phẩm'
            });
        }
    }
};

module.exports = CategoryController;
