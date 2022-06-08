const opinionModel = require('../model/OpinionModel');
const mail = require('../helper/SendMail');

const OpinionsController = {
    store: async function(req, res){
        let opinion = new opinionModel(req.body);
        opinion.save().then((result) => {
            res.json({status: 'success', info: opinion });
        }).catch((err) => {
            
        });
    },

    newest: async function(req, res){
        let opinion = await opinionModel.find().sort({createdAt: -1}).limit(9);
        res.send( opinion );
    },

    delete: async function(req, res){
        let id = req.params.id;
        let opinion = await opinionModel.findByIdAndDelete(id);
        res.json({status: 'success', info: {message: 'Xóa thành công'} });
    },

    getAllPage: async function(req, res){
        let perPage = 10;
        let page = req.params.page || 1;

        let opinion = await opinionModel
            .find()
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({ createdAt: 'asc' });
        res.json(opinion);
    },

    getOne: async function(req, res){
        let id = req.params.id;
        let opinion = await opinionModel.findById(id);
        res.json(opinion);

    },

    sendcontact: async function(req, res){
        console.log(req.body);
        let id = req.params.id;
        let opinion = await opinionModel.findById(id);
        let msg = req.body.msg;
        await mail.sendOpinion(msg, opinion.Email);
        await opinionModel.updateOne({_id: id},{
            Status: 'Đã phản hồi',
            AdminToCustomer: msg
        })
        res.end();
    }
}

module.exports = OpinionsController;