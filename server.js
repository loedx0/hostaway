const express = require('express'); //Line 1
const app = express(); //Line 2
const axios = require('axios');
require('dotenv').config();
const air = require('./airtableservice.js');
const port = process.env.PORT || 5001; //Line 3

// Variables para usar el servicio de get listings, no se pudo con module exports por eso lo dejamos aqui adentro para que funcione
const url = 'https://api.hostaway.com/v1/listings';
const authType = 'Bearer';
const authKey = process.env.API_KEY;
const auth = authType+' '+authKey;
const options = {
  headers: {
    Authorization: auth,
    'Cache-control': 'no-cache',
  },
  params: {
    limit: '',
    offset: '',
    sortOrder: '',
    city: '',
    match: '',
    country: '',
    isSyncig: '',
    contactName: '',
    propertyTypeId: '',
  },
};


//variables for the consolidation report service of hostaway
const urlreport = 'https://api.hostaway.com/v1/finance/report/consolidated';
const fromDateInput = '2023-01-01';
const toDateInput = '2023-02-01';
const listingMapIdsInput = [140052];

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT 2' }); //Line 10
}); //Line 11


// get the consolidation report from hostaway
app.get('/consolidation-report', (req, res) => {
  axios.post(urlreport, {
    format: 'json',
    fromDate: fromDateInput,
    toDate: toDateInput,
    listingMapIds: listingMapIdsInput,
}, {
headers: {
    'Authorization': auth,
    "Content-type": "application/json",
}})
.then((response) => {
  if(response.data.status === "success"){
    const tableData =  {
        listingId: listingMapIdsInput,
        reportFromDate: fromDateInput,
        reportToDate: toDateInput,
        listingAddress: response.data.result.rows[0][11],
        totalGuestFees: response.data.result.totals[13],
        totalTax: response.data.result.totals[14],
        totalRentalRevenue: response.data.result.totals[15],
        totalPmCommission: response.data.result.totals[16],
        totalOwnerPayout: response.data.result.totals[17],
          }
        console.log(tableData);
        res.send({ tableData });
      }
    })
.catch((error) => {
  console.error(error);
  res.send({ error });
});
});

const propertyManager = 345345;

// airtable function to get listings from hostaway
app.get('/hostaway/getlistings', async (req, res) => {
  await axios.get(url, options)
  .then(async (response) => {
    const properties = response.data.result.map((property)=>{
        return {
            id:property.id,
            address:property.address,
            city:property.city,
            state:property.state,
            countryCode:property.countryCode
        }
    }) ;
    console.log(properties);
   await air.postListings(propertyManager, properties);
  })
  .catch((error) => {
    console.error(error);
    return(null);
  });
  res.send({ express: 'air crobby' });
});

// show listings saved in airtable
app.get('/airtable/getlistings', async (req, res) => {
  await air.getListings(propertyManager, function(error, result) {
    if(error) res.send({"ocurrio un error" : error});
    console.log("printing records", result);
    res.send({listings: result})
  })
});


// save new listings from hostaway in airtable
app.get('/savelistings', async (req, res) => {
  await air.getListings(propertyManager, async function(error, currentListings) {
    if(error) res.send({"There was an error reading from Airtable": error});
    await axios.get(url, options)
    .then(async (hostawayListings) => {
      const properties = hostawayListings.data.result.map((property)=>{
          return {
              id:property.id,
              address:property.address,
              city:property.city,
              state:property.state,
              countryCode:property.countryCode
          }
      }) ;
      const newListings = properties.filter(
        newProp => !currentListings.filter(
          current => current.id === newProp.id
        ).length
      );
      await air.postListings(propertyManager, newListings);
      res.send({"These are the new listings": newListings});
    })
    .catch((error) => {
      console.error(error);
      res.send({"There was an error reading from Hostaway": error});
    });
  })
});


// send saved US-only listings to household
app.get('/household/postlistings', async (req, res) => {
  await air.getListings(propertyManager, async function(error, results) {
    if(error) res.send({"There was an error reading from Airtable": error});
    const USProperties = results.filter((property) => property.countryCode === "US");
    const USPropsAddresses = USProperties.map((property) => {
      return {
        address: property.address
      }
    });
    console.log("These are the only US properties", USProperties);
    console.log("the amount of properties saved are", results.length);
    console.log("the amaount of US properties are", USProperties.length);
    console.log("These are the addresses only", USPropsAddresses);
    res.send({"These are the US only Listings": USProperties});
  })
});
