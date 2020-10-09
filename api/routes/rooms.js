const { Router } = require('express')
const router = Router()

const roomController = require('../controllers/roomController')
const checkAuth = require('../checkAuth')

//Get Rooms
router.post('/rooms', checkAuth, checkAuth.test)

module.exports = router