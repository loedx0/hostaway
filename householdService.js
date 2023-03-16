const axios = require('axios');

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
  axios.post("https://api.usehousehold.com/v1/external/companies/create_pm", postManagerBody, {
    headers: {
      "x-hh-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoyMCwiZmlyc3RuYW1lIjoiWWFtaWwiLCJsYXN0bmFtZSI6Ik51w7FleiIsImVtYWlsIjoieWFtaWxAdXNlaG91c2Vob2xkLmNvbSIsImNvbXBhbnlfaWQiOjEsImRvbWFpbiI6InBtYWRtaW4udXNlaG91c2Vob2xkLmNvbSIsImFkZHJlc3MiOiIweDcxZmM3MDA0ODVjZTkyMTc2ODBDNzAxMUI5MzkzYzUzNTk2NjM3ZTYiLCJpYXQiOjE2NzMzNjA0MzV9.1SRrsYETXZ2NUcmp6ouqyLo1_x0KXnTBRuoFOxStTv0",
    }
  })
  .then((response) => { callback(null, response) }).catch((error) => { callback(error, null) });
}

async function postListing(managerId, address, countryCode, callback) {
  const postListingBody = {
    id_company_user: managerId,
    address,
    country: countryCode
  }
  axios.post("https://api.usehousehold.com/v1/external/companies/create_property", postListingBody)
  .then((response) => {callback(null, response.data.property)})
  .catch((error) => {
    console.log("printing household error", error);
    callback(error, null)
  });
}

async function postReportData(
  managerId,
  listingId,
  listingHouseholdId,
  pmCommission,
  rentalRevenue,
  fromDate,
  callback
) {
  const postReportData = {
    property_id: listingHouseholdId,
    id_company_user: managerId,
    charges: [
      {
        "value": rentalRevenue,
        "is_expense": false,
        "label": "Rental-Revenue",
        "type": "rent",
        "period": fromDate,
        "reference": `Hostaway Rental Revenue for ${listingId}`
      },
      {
        "value": pmCommission,
        "is_expense": true,
        "label": "PM-Commission",
        "type": "pm_services",
        "period": fromDate,
        "reference": `Hostaway PM Commission for ${listingId}`
      }
    ]
  };
  axios.post("https://api.usehousehold.com/v1/external/companies/property_charges", postReportData, {
    headers: {
      "x-hh-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoyMCwiZmlyc3RuYW1lIjoiWWFtaWwiLCJsYXN0bmFtZSI6Ik51w7FleiIsImVtYWlsIjoieWFtaWxAdXNlaG91c2Vob2xkLmNvbSIsImNvbXBhbnlfaWQiOjEsImRvbWFpbiI6InBtYWRtaW4udXNlaG91c2Vob2xkLmNvbSIsImFkZHJlc3MiOiIweDcxZmM3MDA0ODVjZTkyMTc2ODBDNzAxMUI5MzkzYzUzNTk2NjM3ZTYiLCJpYXQiOjE2NzMzNjA0MzV9.1SRrsYETXZ2NUcmp6ouqyLo1_x0KXnTBRuoFOxStTv0",
    }
  })
  .then((response) => { callback(null, response) }).catch((error) => { callback(error, null) });
}

module.exports = {
  postManager,
  postListing,
  postReportData,
};