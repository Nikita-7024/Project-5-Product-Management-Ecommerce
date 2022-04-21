const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const middleware = require('../middlewares/auth');
const multer = require('multer');

router.use(multer().any());


//user APIs-----------------------------------
router.post('/register', userController.createUser);

router.post('/login', userController.userLogIn);

router.get('/user/:userId/profile', middleware.auth ,userController.getUserProfile);

router.put('/user/:userId/profile', middleware.auth, userController.updateUserProfile);

//product APIs---------------------------------
router.post('/products', productController.createProduct);

router.get('/products', productController.getProductsByFilter);

router.get('/products/:productId', productController.getProductsById);

router.put('/products/:productId', productController.updateProductById);

router.delete('/products/:productId', productController.deleteProductById);

//cart APIs------------------------------------
router.post('/users/:userId/cart',  cartController.createCart);

router.put('/users/:userId/cart',  cartController.updateCart);

router.get('/users/:userId/cart', cartController.getCartById);

router.delete('/users/:userId/cart',  cartController.deleteCartById);

//order APIs----------------------------

router.post('/users/:userId/orders', middleware.auth, orderController.createOrder);

router.put('/users/:userId/orders', middleware.auth, orderController.updateOrder);








module.exports = router;