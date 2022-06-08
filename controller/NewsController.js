const newsModel = require('../model/NewsModel');

const NewsController = {
    getAllPage: async function(req, res){
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;

        let news = await newsModel
            .find()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({ createdAt: 'asc' });
        res.json(news);
    },

    getOneNews: async function(req, res){
        let { id } = req.params;
        let news = await newsModel.findById(id);
        if(news){
            res.json({ status: 'success', info:news});
        } else {
            res.json({ status: 'failed', info: 'Không thể tỉm thấy tin tức này'});
        }
        
    },

    getOneNewsBySlug: async function(req, res){
        let { slug } = req.params;
        let news = await newsModel.findOne( {nSlug: slug} );
        if(news){
            res.json({ status: 'success', info:news});
        } else {
            res.json({ status: 'failed', info: 'Không thể tỉm thấy tin tức này'});
        }
        
    },

    create: async function(req, res){
        console.log(req.body.nBody);
        let { nTitle, nAvatar, nBody, nCategory, nStatus } = req.body;
        try {
            // if(!nTitle || !nAvatar || !nBody || !nCategory || !nStatus){
            //     return res.json({status: 'falied', info:'Vui lòng nhập đầy đủ thông tin'});
            // }
            let news = new newsModel({
                nTitle: req.body.nTitle,
                nAvatar: req.body.nAvatar,
                nBody: 'dfdsf',
                nCategory: req.body.nCategory,
                nStatus: req.body.nStatus
            });
            await news.save();
            return res.json({status: 'success', info: 'Thêm thành công'});
        } catch (error) {
            res.end();
        }
    },

    edit: async function(req, res){
        let { nTitle, nAvatar, nBody, nCategory, nStatus } = req.body;
        try {
            if(!nTitle || !nAvatar || !nBody || !nCategory || !nStatus){
                return res.json({status: 'falied', info:'Vui lòng nhập đầy đủ thông tin'});
            }
            let news = await newsModel.updateOne({ _id: req.params.id },req.body);
            res.json({status: 'success', info: 'Chỉnh sửa thành công'});
        } catch (error) {
            res.end();
        }
        
    }
}

module.exports = NewsController;

