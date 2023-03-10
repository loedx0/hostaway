const axios = require('axios');

// Variables to get listings
const urlListings = 'https://api.hostaway.com/v1/listings';

const authType = 'Bearer';
const authKey = process.env.API_KEY;
const auth = authType+' '+authKey;
const options = {
  headers: {
    Authorization: auth,
    'Cache-control': 'no-cache',
  }
};

// variables to get the access token
const urlToken = 'https://api.hostaway.com/v1/accessTokens';

async function getAccessToken(client_id, client_secret, callback) {
  const test = `grant_type=client_credentials&scope=general&client_id=${client_id}&client_secret=${client_secret}`;
  axios.post(urlToken, test, { headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache",
  }})
  .then((response) => {
    if(response.data.status === "success") {
    }
    callback(null, response.data.access_token);
  })
  .catch((error) => {
    console.error(error);
    callback(error, null);
  });
}

//variables for the consolidation report service of hostaway
const urlReport = 'https://api.hostaway.com/v1/finance/report/consolidated';

async function getConsolidationReport(
  managerId,
  listingId,
  listingAddress,
  fromDateInput,
  toDateInput,
  callback
) {
  axios.post(urlReport, {
    format: 'json',
    fromDate: fromDateInput,
    toDate: toDateInput,
    listingMapIds: [listingId],
  }, {
  headers: {
      'Authorization': auth,
      "Content-type": "application/json",
  }})
  .then((response) => {
    if(response.data.status === "success" && response.data.result.rows.length > 0){
      const tableData =  {
        listingId: parseInt(listingId),
        reportFromDate: fromDateInput,
        reportToDate: toDateInput,
        listingAddress: listingAddress? listingAddress: response.data.result.rows[0][11],
        listingAddressDescription: response.data.result.rows[0][11],
        totalGuestFees: response.data.result.totals[13],
        totalTax: response.data.result.totals[14],
        totalRentalRevenue: response.data.result.totals[15],
        totalPmCommission: response.data.result.totals[16],
        totalOwnerPayout: response.data.result.totals[17],
      }
      callback(null, tableData);
    }
  })
  .catch((error) => {
    console.error(error);
    callback(error, null);
  });
}

async function getListings(callback) {
  await axios.get(urlListings, options)
  .then(async (response) => {
    const properties = response.data.result.map((property)=>{
        return {
            id:property.id,
            address:property.address,
            city:property.city,
            state:property.state,
            countryCode:property.countryCode,
            zipcode:property.zipcode
        }
    });
    callback(null, properties);
  })
  .catch((error) => {
    console.error(error);
    callback(error, null);
  });
}


module.exports = {
  getAccessToken,
  getConsolidationReport,
  getListings,
}