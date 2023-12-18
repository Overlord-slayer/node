const express = require('express')
const router = express.Router()
const logoutControllers= require('../controllers/logoutController')

router.get('/', logoutControllers.handlerLogout)

module.exports = router