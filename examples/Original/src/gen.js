const crypto = require('crypto');
const Token = require('./models/token');

async function generateToken() {
  const token = crypto.randomBytes(16).toString('hex');
  await Token.create({ token, status: 'inactive' });
  console.log(`Generated token: ${token}`);
}

generateToken();