const Airtable = require('airtable');
// const base = new Airtable({ apiKey: 'patDvsWp9XhsDlAHq.cd8eb50aa23dc53594cd72e5c174276a83f354322386a5052750fb07587cdd26' }).base('appiAQlskdhkqvGi5');
const base = new Airtable({apiKey: 'keyFvlhZwWyCrAKS4'}).base("appa8Kj9qD3QLzOdD");

const listingsFields = {
  id: 'ID',
  address: 'Address',
  city: 'City',
  state: 'State',
  countryCode: 'Country Code',
  managerId: "ID Property Manager",
  propertyOwner: "Property Owner",
};

async function postListings(managerId, propertylist) {
  propertylist?.forEach(property => {
  // base('tbldeBq4ZZWIm0DZq').create({
    base('listings').create({
        [listingsFields.id]: property.id ,
        [listingsFields.address]: property.address,
        [listingsFields.city]: property.city,
        [listingsFields.state]: property.state,
        [listingsFields.countryCode]: property.countryCode,
        [listingsFields.managerId]: managerId
      }, function(err, record) {
        if (err) { console.error(err); return; }
      }
    );
  });
};

async function getListings(managerId, findUnowned, responseCallback) {
  const onlyUnowned = findUnowned ? ", ({Property Owner} = '')" : "";
  // base('tbldeBq4ZZWIm0DZq').select({
  base('listings').select({
    filterByFormula: `AND(({ID Property Manager} = ${managerId} )` + onlyUnowned +`)`
  }).all((error, records) => {
    if(error) {
      console.log("Airtable returned error", error);
      responseCallback(error, null);
    }
    const formattedRecords = records.map((listing) => ({
      airtableId: listing.id,
      id: listing.get("ID"),
      address: listing.get("Address"),
      city: listing.get("City"),
      state: listing.get("State"),
      countryCode: listing.get("Country Code"),
      propertyOwner: listing.get("Property Owner"),
      managerId
    }));
    responseCallback(null, formattedRecords);
  });
};


const reportFields = {
  id: 'ID',
  address: 'Address',
  addressDescription: "Address Description",
  listingId: 'ID Listing',
  fromDate: 'From Date',
  toDate: 'To Date',
  guestFees: 'Guest Fees',
  taxes: 'Taxes',
  rentalRevenue: 'Rental Revenue',
  pmCommission: 'PM Commission',
  ownerPayout: 'Owner Payout',
};

async function postReportData(listingId, reportData) {
  base('listing-reports').create({
    [reportFields.address]: reportData.listingAddress,
    [reportFields.addressDescription]: reportData.listingAddressDescription,
    [reportFields.listingId]: [parseInt(reportData.listingId)],
    [reportFields.fromDate]: reportData.reportFromDate,
    [reportFields.toDate]: reportData.reportToDate,
    [reportFields.guestFees]: parseFloat(reportData.totalGuestFees),
    [reportFields.taxes]: parseFloat(reportData.totalTax),
    [reportFields.rentalRevenue]: parseFloat(reportData.totalRentalRevenue),
    [reportFields.pmCommission]: parseFloat(reportData.totalPmCommission),
    [reportFields.ownerPayout]: parseFloat(reportData.totalOwnerPayout),
  },
  { typecast: true },
  function(error, response) {
    if(error) console.log(error);
  });
};

const hostawayIntegrationFields = {
  managerId: "ID Property Manager",
  token: "Token",
  secret: "Secret",
  clientId: "ID Hostaway",
  email: "Email",
  company: "Company",
};

async function postManagerHostawayIntegration(
  managerId,
  clientId,
  secret,
  email,
  company,
  callback
) {
  base('hostaway-integration').create({
    [hostawayIntegrationFields.managerId]: managerId,
    [hostawayIntegrationFields.clientId]: clientId,
    [hostawayIntegrationFields.secret]: secret,
    [hostawayIntegrationFields.email]: email,
    [hostawayIntegrationFields.company]: company,
  }, { typecast: true }, function(error, response) {
    if(error) {
      console.log("there was an error creating hostaway integration", error);
      callback(error, null);
    }
    callback(null, response);
  })
};

async function getUserIntegration(managerId, callback) {
  base('hostaway-integration').select({
      filterByFormula: `({ID Property Manager} = ${managerId} )`
  }).all(async (error, integration) => {
    if(error) {
      console.log("there was an error getting the integration user");
      callback(error, null);
    }
    const formattedResponse = {
      airtableId: integration[0].id,
      managerId: integration[0].get("ID Property Manager"),
      token: integration[0].get("Token"),
      hostawayId: integration[0].get("ID Hostaway"),
      email: integration[0].get("Email"),
      company: integration[0].get("Company"),
    }
    callback(null, formattedResponse);
  });
}

async function setAccessToken(integrationId, token, callback) {
  base('hostaway-integration').update([
    {
      "id": integrationId,
      "fields": {
        [hostawayIntegrationFields.token]: token,
      }
    },
  ], function(error, response) {
    if(error) {
      console.log("there was an error setting the integration token");
      callback(error, null);
    }
    callback(null, response);
  });
};

module.exports = {
  postListings,
  getListings,
  postReportData,
  postManagerHostawayIntegration,
  setAccessToken,
  getUserIntegration,
};

