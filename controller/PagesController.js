const pagesModel = require('../model/PagesModel');

const PagesController = {
    edit: async function(req, res){
        console.log(req.body);
        let { pTitle, pSlug, pBody } = req.body;
        try {
            if(!pTitle || !pSlug || !pBody){
                return res.json({ status: 'error', info: {message: 'Vui lòng nhập đầy đủ thông tin'}})
            }
            
            await pagesModel.updateOne({_id: req.params.id},{
                pTitle: pTitle,
                pSlug: pSlug,
                pBody: pBody
            })
            res.json({status: 'success',info:{message:'Cập nhật thành công'}});
        } catch (error) {
            console.log('lỗi server');
        }
    },

    getAllPage: async function(req, res){
        let perPage = 10;
        let page = req.params.page || 1;

        let pages = await pagesModel
            .find()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({ createdAt: 'asc' });
        res.json(pages);
    },

    getOne: async function(req, res){
        let pages = await pagesModel.findOne({pSlug: req.params.slug});
        if(pages !== null){
            res.json({status: 'success', info: pages});
        } else {
            res.json({status: 'error', info: { message: '404'}});
        }
    },

    getOneId: async function(req, res){
        let id = req.params.id;
        let pages = await pagesModel.findById(id);
        if(pages !== null){
            res.json({status: 'success', info: pages});
        } else {
            res.json({status: 'error', info: { message: '404'}});
        }
    },

    create: async function(req, res){
        console.log(req.body);
        let { pTitle, pSlug, pBody } = req.body;
        if(!pTitle, !pSlug, !pBody ){
            return res.json({status: 'success', info: { message: 'Lưu thành công'}});
        }
        let page = new pagesModel(req.body);
        page.save();
        return res.json({status: 'success', info: { message: 'Lưu thành công'}});
    },

    delete: async function(req, res){
        let id = req.params.id;
        let page = await pagesModel.findByIdAndDelete(id);
        res.json({status: 'success', info: {message: 'Xóa thành công'} });
    },
}

module.exports = PagesController;

