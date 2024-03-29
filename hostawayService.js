const axios = require('axios');

const authType = 'Bearer';

async function getAccessToken(client_id, client_secret, callback) {
  const test = `grant_type=client_credentials&scope=general&client_id=${client_id}&client_secret=${client_secret}`;
  axios.post('https://api.hostaway.com/v1/accessTokens', test, { headers: {
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

async function getConsolidationReport(
  token,
  listingId,
  listingAddress,
  fromDateInput,
  toDateInput,
  callback
) {
  const auth = authType+' '+token;
  axios.post('https://api.hostaway.com/v1/finance/report/consolidated', {
    format: 'json',
    fromDate: fromDateInput,
    toDate: toDateInput,
    listingMapIds: [listingId],
    statuses: ["new", "modified"],
  }, {
  headers: {
      'Authorization': auth,
      "Content-type": "application/json",
  }})
  .then((response) => {
    if(response.data.result.rows.length > 0){
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
    } else {
      callback(null, null);
    }
  })
  .catch((error) => {
    console.log(error);
    callback(error, null);
  });
}

async function getListings(token, callback) {
  const auth = authType+' '+token;
  const options = {
    headers: {
      Authorization: auth,
      'Cache-control': 'no-cache',
    }
  };
  await axios.get('https://api.hostaway.com/v1/listings', options)
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