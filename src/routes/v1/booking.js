const express = require('express');

const { BookingController } = require('../../controllers')
// const { AirportMiddlewares } = require('../../middlewares')

const router = express.Router();

// /api/v1/airports POST
router.post('/', 
        BookingController.createBooking);

router.post('/payment',
        BookingController.makePayment
);
module.exports = router;