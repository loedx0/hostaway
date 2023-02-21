const axios = require('axios');

const clientId = process.env.HOSTAWAY_ID ;
const clientSecret = process.env.SECRET_API_KEY;

const requestData = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=general`;

axios.post('https://api.hostaway.com/v1/accessTokens', requestData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache',
  },
})
  .then(response => {
    const accessToken = response.data.access_token;
    // use the access token to make further requests to the Hostaway API
    console.log(accessToken);
  })
  .catch(error => {
    console.error(error);
  });
