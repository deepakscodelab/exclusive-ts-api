"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToNewsletter = subscribeToNewsletter;
const constants_1 = require("./constants");
const mailchimp = require('mailchimp-v3');
mailchimp.setApiKey(constants_1.constants.mail.mailchimpApiKey);
const listID = '';
// ========================
// Subscribe to main list
// ========================
function subscribeToNewsletter(email) {
    return mailchimp
        .post(`lists/${listID}/members`, {
        email_address: email,
        status: 'subscribed'
    })
        .then((result) => {
        console.log(`${email} has been subscribed to Mailchimp.`);
    })
        .catch((err) => {
        console.log('Mailchimp error.');
    });
}
