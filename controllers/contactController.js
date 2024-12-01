const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
/**
 * Module for handling the contact us functionality.
 * @module contactController
 */
const sendEmail = require('../utils/sendEmail');

/**
 * Handles the process of sending an email when a user submits the contact form.
 * @async
 * @function contactUS
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully.
 * @throws {Error} If there is an issue with sending the email, an error is thrown with a corresponding message.
 */
const contactUS = asyncHandler(async (req, res) => {
    const {subject, message} = req.body;
    const user = await User.findById(req.user._id);

    if(!user) {
        res.status(404);
        throw new Error('User not found, Please signup');
    }

    //Validation
    if(!subject || !message) {
        res.status(404);
        throw new Error('Please add subject and message');
    }

    const send_to = process.env.EMAIL_USER;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email;

    try {
        await sendEmail(subject, message, send_to, sent_from, reply_to);
        res.status(200).json({success: true, message: 'Email Sent'});
    } catch (error) {
        res.status(500);
        throw new Error('Email not sent, please try again');
    }
});

module.exports = {
    contactUS,
}