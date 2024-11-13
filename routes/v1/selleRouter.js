const express = require('express')
const { registerSeller, loginSeller, logoutSeller, getSellersList } = require('../../controllers/sellerController')
const { adminAuth } = require('../../middlewares/adminAuth')
const { sellerAuth } = require('../../middlewares/sellerAuth')
const router = express.Router()

// Register seller
router.post('/register', registerSeller)
// Login seller
router.post('/login', loginSeller)
// logout seller
router.post('/logout', sellerAuth, logoutSeller)
// get seller
router.get('/allSellers' , adminAuth, getSellersList)

module.exports = {sellerRouter: router}