var express = require('express');
var router = express.Router();
var multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});
const upload = multer({ storage: storage });


const accountController = require('../controller/AccountController');
const categoryController = require('../controller/CategoryController');
const cartController = require('../controller/CartController');
const imageController = require('../controller/ImageController');
const orderController = require('../controller/OrderController');
const productController = require('../controller/ProductController');
const sliderController = require('../controller/SliderController');
const newsController = require('../controller/NewsController');
const pagesController = require('../controller/PagesController');
const opinionsController = require('../controller/OpinionsController');

//PRODUCT
router.post('/createproduct', productController.createProduct);
router.post('/editproduct/:id', productController.editProduct);
router.get('/getnewproduct', productController.getNewProduct);
router.get('/getsaleproduct', productController.getSaleProduct);
router.get('/gettrashproduct', productController.getTrashProduct);
router.get('/getsuggestproduct/:slug', productController.suggest);
router.post('/getoneproductbyslug', productController.getOneProducyBySlug);
router.get('/getoneproduct/:id', productController.getOneProduct);
router.post('/getallproductbyslug', productController.getAllProducyByCategorySlug );
router.post('/findproduct', productController.findProduct);
router.post('/paginationProduct', productController.paginationProduct);
router.get('/deleteproduct/:id', productController.deleteProduct)
router.get('/duplicate/:id', productController.duplicateProduct)
router.get('/changestatusproduct/:id', productController.changeStatus);
router.get('/changetrashproduct/:id', productController.changeTrash);
router.post('/getallproductsale' , productController.getAllSaleProduct)

//CATEGORY
router.get('/getshowcategory', categoryController.getShowCategory);
router.get('/getallcategory', categoryController.getAllCategory);
router.post('/getonecategory', categoryController.getOneCategory);

router.post('/createcategory', categoryController.createCategory);

router.post('/deletecategory', categoryController.deleteCategory);
router.post('/changeposition', categoryController.changePosition);
router.get('/changestatuscategory/:id', categoryController.changeStatus);
router.post('/findCategory', categoryController.find);
router.post('/editcategory/:id', categoryController.edit);

//ACCOUNT
router.post('/login', accountController.login);
router.post('/loginadmin', accountController.loginadmin);
router.post('/register', accountController.register);
router.post('/getOneAccount', accountController.getOneAccount);
router.get('/listuser', accountController.getAllAccount);
router.post('/changepassword', accountController.changepassword);
router.post('/changepassword/:email/:token', accountController.dochangepassword);
router.post('/checktokenpassword', accountController.checkToken);
router.get('/changestatusaccount/:id', accountController.changeStatus)
router.get('/deleteaccount/:id', accountController.delete)
router.post('/editaccount/:id', accountController.edit)

//CART
router.post('/addtocart', cartController.addToCart);
router.post('/viewcart', cartController.viewCart);
router.post('/deletecart', cartController.deleteCart);
router.post('/updatesize', cartController.updatesize);
router.post('/updatequantity', cartController.updatequantity);

//ORDER
router.get('/ordernewest', orderController.newest);
router.get('/order/:id', orderController.getOneByID);
router.post('/orderbyuserid', orderController.getOneByUserID);
router.post('/checkout', orderController.checkOut);
router.get('/orderconfirm/:id', orderController.confirmOrder);
router.get('/listorder', orderController.listOrder);
router.post('/orderstatus/:id', orderController.changeStatus);

router.post('/totalorder', orderController.totalMonth);


//IMAGE
router.get('/getallimage', imageController.getAllImage);
router.post('/uploadimage', upload.array('image', 12), imageController.uploadImage );
router.get('/deleteimage/:id', imageController.deleteImage);

//SLIDER
router.get('/getslide', sliderController.getSlider);
router.post('/deleteslide', sliderController.deleteSlider);
router.post(
    '/uploadslide',
    upload.single('image'),
    sliderController.uploadSlider
);

//NEWS
router.get('/getonenews/:id', newsController.getOneNews);
router.get('/getallbypage/:page', newsController.getAllPage);
router.post('/creatnews', newsController.create);
router.post('/editnews/:id', newsController.edit);
router.get('/getonenewslug/:slug', newsController.getOneNewsBySlug);

//PAGES
router.post('/creatpages', pagesController.create);
router.get('/getonepage/:slug', pagesController.getOne);
router.get('/getonepageId/:id', pagesController.getOneId);
router.get('/getallpages', pagesController.getAllPage);
router.get('/deletepages/:id', pagesController.delete);
router.post('/editpage/:id', pagesController.edit);

//OPINION
router.post('/contact', opinionsController.store);
router.get('/contactnewest', opinionsController.newest);
router.post('/sendcontact/:id', opinionsController.sendcontact);
router.get('/getallcontact', opinionsController.getAllPage);
router.get('/getonecontact/:id', opinionsController.getOne);
router.get('/deletecontact/:id', opinionsController.delete);

router.post('/test', (req, res)=>{
    res.json(req.body);
})

module.exports = router;
