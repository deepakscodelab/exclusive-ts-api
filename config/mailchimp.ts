import { constants } from './constants';

const mailchimp = require('mailchimp-v3');

mailchimp.setApiKey(constants.mail.mailchimpApiKey);

const listID = '';

// ========================
// Subscribe to main list
// ========================

export function subscribeToNewsletter(email: string): Promise<void> {
  return mailchimp
    .post(`lists/${listID}/members`, {
      email_address: email,
      status: 'subscribed'
    })
    .then((result: any) => {
      console.log(`${email} has been subscribed to Mailchimp.`);
    })
    .catch((err: any) => {
      console.log('Mailchimp error.');
    });
}
