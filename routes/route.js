const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const middleware = require('../middlewares/auth');
const multer = require('multer');

router.use(multer().any());


//user APIs
router.post('/register', userController.createUser);

router.post('/login', userController.userLogIn);

router.get('/user/:userId/profile', middleware.auth ,userController.getUserProfile);

router.put('/user/:userId/profile', middleware.auth, userController.updateUserProfile);

//product APIs
router.post('/products', productController.createProduct);

router.get('/products', productController.getProductsByFilter);

router.get('/products/:productId', productController.getProductsById);

router.put('/products/:productId', productController.updateProductById);

router.delete('/products/:productId', productController.deleteProductById);







module.exports = router;