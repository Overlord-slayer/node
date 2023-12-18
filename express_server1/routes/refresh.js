const express = require('express')
const router = express.Router()
const refreshTokenControllers= require('../controllers/refreshTokenController')

router.get('/', refreshTokenControllers.handlerRefreshToken)

module.exports = router