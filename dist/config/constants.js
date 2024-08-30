"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
exports.constants = Object.freeze({
    database: {
        SCHEMA_NAME: 'dev',
        DATABASE: 'mongodb://localhost:27017'
    },
    stripe: {
        STRIPEAPIKEY: '<stripe key>'
    },
    mail: {
        mailgun_priv_key: 'mailgun private key here',
        mailgun_domain: 'mailgun domain here',
        mailchimpApiKey: 'mailchimp api key here',
        sendgridApiKey: 'sendgrid api key here'
    },
    SECRET: '<secret key>'
});
