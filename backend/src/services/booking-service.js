const { StatusCodes } = require('http-status-codes');

const { BookingRepository, FlightRepository } = require('../repositories')
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

const bookingRepository = new BookingRepository();
const flightRepository = new FlightRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await flightRepository.get(data.flightId, transaction);
        if(data.noOfSeats > flight.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flight.price;

        if (data.promoCode) {
            const voucher = await voucherRepository.findByCode(data.promoCode, transaction);
            if (!voucher) {
                throw new AppError('Invalid voucher code', StatusCodes.BAD_REQUEST);
            }
            if (voucher.quantity <= 0) {
                throw new AppError('Voucher is out of stock', StatusCodes.BAD_REQUEST);
            }
            if (new Date(voucher.expiresAt) < new Date()) {
                throw new AppError('Voucher is expired', StatusCodes.BAD_REQUEST);
            }

            await voucher.decrement('quantity', { by: 1, transaction: transaction });

            if (voucher.discountType === 'percent') {
                totalBillingAmount = totalBillingAmount - (totalBillingAmount * (voucher.discountValue / 100));
            } else {
                totalBillingAmount = Math.max(0, totalBillingAmount - voucher.discountValue); // Đảm bảo giá không âm
            }
        }

        const bookingPayload = { ...data, totalCost: totalBillingAmount};
        const booking = await bookingRepository.create(bookingPayload, transaction);

        await flight.decrement('totalSeats', {
            by: data.noOfSeats,
            transaction: transaction
        });

        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
         
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        if(bookingDetails.status == CANCELLED) {
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000) {
            await cancelBooking(data.bookingId);
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.totalCost != data.totalCost) {
            throw new AppError('The amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId) {
            throw new AppError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);   
        }
         await bookingRepository.update(data.bookingId, {status: BOOKED}, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);
        if(bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }
        const flight = await flightRepository.get(booking.flightId, transaction);
        await flight.increment('totalSeats', {
            by: booking.noOfSeats,
            transaction: transaction
        });
        await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelOldBookings() {
    try {
        const time = new Date( Date.now() - 1000 * 300 );
        const response = await bookingRepository.cancelOldBookings(time);
        return response;
    } catch (error) {
        console.log(error);        
    }
}

module.exports = {
    createBooking,
    makePayment, 
    cancelBooking,
    cancelOldBookings
}