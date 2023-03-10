const axios = require('axios');

const urlPostManager = "https://api.usehousehold.com/v1/external/companies/create_pm";


async function postManager(companyName, companyIdentifier, email, firstname, lastname, callback) {
  const postManagerBody = {
    company: {
      company_name: companyName,
      identifier: companyIdentifier,
    },
    client: {
      email,
      country_id: 252,
      firstname,
      lastname,
    }
  }
  axios.post(urlPostManager, postManagerBody, {
    headers: {
      "x-hh-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoyMCwiZmlyc3RuYW1lIjoiWWFtaWwiLCJsYXN0bmFtZSI6Ik51w7FleiIsImVtYWlsIjoieWFtaWxAdXNlaG91c2Vob2xkLmNvbSIsImNvbXBhbnlfaWQiOjEsImRvbWFpbiI6InBtYWRtaW4udXNlaG91c2Vob2xkLmNvbSIsImFkZHJlc3MiOiIweDcxZmM3MDA0ODVjZTkyMTc2ODBDNzAxMUI5MzkzYzUzNTk2NjM3ZTYiLCJpYXQiOjE2NzMzNjA0MzV9.1SRrsYETXZ2NUcmp6ouqyLo1_x0KXnTBRuoFOxStTv0",
    }
  })
  .then((response) => { callback(null, response) }).catch((error) => { callback(error, null) });
}

module.exports = {
  postManager,
};