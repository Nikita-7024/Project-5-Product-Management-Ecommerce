const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middlewares/auth');
const multer = require('multer');

router.use(multer().any());

router.post('/register', userController.createUser);

router.post('/login', userController.userLogIn);

router.get('/user/:userId/profile', middleware.auth ,userController.getUserProfile);

router.put('/user/:userId/profile', middleware.auth, userController.updateUserProfile);








module.exports = router;