module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET','4mu7cvNFo6qlA8mFpiTn+g'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'x1SAxevOJAaJorX3CEWvzQ'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
