// services/dapinSmsService.js
const axios = require('axios');
require('dotenv').config();

const API_URL = 'https://smsportal.dapintechnologies.com/sms/v3/sendsms';

async function sendSms({ to, message, scheduleDate = null }) {
  if (!process.env.DAPIN_SMS_API_KEY) {
    throw new Error('DAPIN_SMS_API_KEY missing in .env');
  }

  const payload = {
    api_key: process.env.DAPIN_SMS_API_KEY,
    service_id: 0, // ask your provider if this must change
    mobile: to,
    response_type: 'json',
    shortcode: process.env.DAPIN_SMS_SENDER,
    message,
    ...(scheduleDate ? { date_send: scheduleDate } : {})
  };

  const resp = await axios.post(API_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  });

  return resp.data;
}

module.exports = { sendSms };
