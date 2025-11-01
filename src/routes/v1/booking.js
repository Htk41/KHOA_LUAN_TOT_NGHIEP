const express = require('express');

const { BookingController } = require('../../controllers')
// const { AirportMiddlewares } = require('../../middlewares')

const router = express.Router();

// /api/v1/airports POST
router.post('/', 
        BookingController.createBooking);

module.exports = router;