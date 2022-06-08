const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 5000;
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

var apiRouter = require('./routes/api');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');

// Conect to db
mongoose
    .connect(process.env.MONGO_DB, {
        useUnifiedTopology: true
    })
    .then(console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API Document - Đặng Thế Vinh',
            version: '1.0.0',
            description: 'A simple Express Library API'
        }
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsDoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'));

// Route
app.use('/v1/api', apiRouter);

app.listen(port, () => {
    console.log(`App listening at port: ${port}`);
});


app.post('/upload',multipartMiddleware,(req,res)=>{
    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            var newPath = __dirname + '/public/image/' + req.files.upload.name;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({err: err});
                else {
                    console.log(req.files.upload.originalFilename);
                //     imgl = '/images/req.files.upload.originalFilename';
                //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
                //    res.status(201).send(img);
                 
                    let fileName = req.files.upload.name;
                    let url = '/images/'+fileName;                    
                    let msg = 'Upload successfully';
                    let funcNum = req.query.CKEditorFuncNum;
                    console.log({url,msg,funcNum});
                   
                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
                }
            });
        });
       } catch (error) {
           console.log(error.message);
       }
})