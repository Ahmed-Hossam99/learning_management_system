const twilio = require('twilio');

const client = twilio(
    "ACprocess.env.TWILIO_ACCOUNT_SID",
    "process.env.TWILIO_TOKEN"
);


module.exports = {
    async sendVerificationCode(phoneNumber) {
        return await client
            .verify.services(process.env.TWILIO_ACCOUNT_VERIFY_SID)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
    },

    async verificationCode(phoneNumber, code) {
        return await client
            .verify.services(process.env.TWILIO_ACCOUNT_VERIFY_SID)
            .verificationChecks
            .create({ code, to: phoneNumber });
    }
};

// https://www.twilio.com/docs/verify/api => overview
// you need only second and third step (in your code , first step from console account)
// https://www.twilio.com/docs/verify/api/service => sid(VA..) will create when you create service in this step 
//  https://www.twilio.com/docs/verify/api/verification => second step
// https://www.twilio.com/docs/verify/api/verification-check => third step
// we dont need to mobile number
// You cant know the code sent to mobile