const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyFvlhZwWyCrAKS4'}).base("appa8Kj9qD3QLzOdD");

const listingsFields = {
  id: 'ID',
  address: 'Address',
  city: 'City',
  state: 'State',
  zipcode: "Zipcode",
  countryCode: 'Country Code',
  managerId: "ID Property Manager",
  propertyOwner: "Property Owner",
  householdId: "ID Household",
};

async function postListings(managerId, propertylist) {
  propertylist?.forEach(property => {
    base('listings').create({
        [listingsFields.id]: property.id ,
        [listingsFields.address]: property.address,
        [listingsFields.city]: property.city,
        [listingsFields.state]: property.state,
        [listingsFields.countryCode]: property.countryCode,
        [listingsFields.managerId]: managerId,
        [listingsFields.zipcode]: property.zipcode,
        // [listingsFields.householdId]: property.householdId,
      }, { typecast: true }, function(err, record) {
        if (err) { console.error(err); return; }
      }
    );
  });
};

async function postListing(managerId, householdId, property) {
  const listingObj = {
    [listingsFields.id]: property.id ,
    [listingsFields.address]: property.address,
    [listingsFields.city]: property.city,
    [listingsFields.state]: property.state,
    [listingsFields.countryCode]: property.countryCode,
    [listingsFields.managerId]: managerId,
    [listingsFields.zipcode]: property.zipcode,
  }
  if(householdId > 0){
    listingObj["ID Household"] = householdId;
  }
  base('listings').create(listingObj, { typecast: true }, function(err, record) {
      if (err) { console.error(err); return; }
    }
  );
};

async function getListings(managerId, findUnowned, responseCallback) {
  const onlyUnowned = findUnowned ? ", ({Property Owner} = '')" : "";
  base('listings').select({
    filterByFormula: `AND(({ID Property Manager} = ${managerId} )` + onlyUnowned +`)`
  }).all((error, records) => {
    if(error) {
      console.log("Airtable returned error", error);
      responseCallback(error, null);
    }
    if(records.length > 0){
      const formattedRecords = records.map((listing) => ({
        airtableId: listing.id,
        id: listing.get("ID"),
        address: listing.get("Address"),
        city: listing.get("City"),
        state: listing.get("State"),
        countryCode: listing.get("Country Code"),
        propertyOwner: listing.get("Property Owner"),
        zipcode: listing.get('Zipcode'),
        householdId: listing.get('ID Household'),
        managerId
      }));
      responseCallback(null, formattedRecords);
    } else { responseCallback(null, []) };
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
  managerId: "ID Property Manager",
};

async function postReportData(managerId, listingId, reportData) {
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
    [reportFields.managerId]: managerId,
  },
  { typecast: true },
  function(error, response) {
    if(error) console.log(error);
  });
};

async function getReportData(managerId, callback) {
  base('listing-reports').select({
      filterByFormula: `({ID Property Manager} = ${managerId} )`
  }).all(async (error, reportData) => {
    if(error) {
      console.log("there was an error getting the report data");
      callback(error, null);
    }
    const formattedResponse = reportData.map((report) => {
      return {
        airtableId: report.id,
        airtableListingId: report.get("ID Listing"),
        fromDate: report.get("From Date"),
        toDate: report.get("To Date"),
        address: report.get("Address"),
        addressDescription: report.get("Address Description"),
        guestFees: report.get("Guest Fees"),
        taxes: report.get("Taxes"),
        rentalRevenue: report.get("Rental Revenue"),
        pmCommission: report.get("PM Commission"),
        ownerPayout: report.get("Owner Payout"),
      }
    });
    callback(null, formattedResponse);
  });
}

const hostawayIntegrationFields = {
  managerId: "ID Property Manager",
  token: "Token",
  secret: "Secret",
  clientId: "ID Hostaway",
  email: "Email",
  company: "Company",
  companyIdentifier: "Company Identifier",
  firstName: "First Name",
  lastName: "Last Name",
};

async function postManagerHostawayIntegration(
  managerId,
  clientId,
  secret,
  email,
  company,
  companyIdentifier,
  firstName,
  lastName,
  token,
  callback
) {
  base('hostaway-integration').create({
    [hostawayIntegrationFields.managerId]: managerId,
    [hostawayIntegrationFields.clientId]: clientId,
    [hostawayIntegrationFields.secret]: secret,
    [hostawayIntegrationFields.email]: email,
    [hostawayIntegrationFields.company]: company,
    [hostawayIntegrationFields.companyIdentifier]: companyIdentifier,
    [hostawayIntegrationFields.firstName]: firstName,
    [hostawayIntegrationFields.lastName]: lastName,
    [hostawayIntegrationFields.token]: token,
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
  try{
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
  } catch(e) {}
};

async function getManager(email, callback) {
  base('hostaway-integration').select({
    filterByFormula: `(Email = '${email}')`,
  }).all((error, response) => {
    try{
      if(error){
        console.log("There was an error trying to get manager", error);
        callback(error, null);
      }
      if(response.length > 0){
        const formattedResponse = {
          managerId: response[0].get("ID Property Manager"),
          token: response[0].get("Token"),
          email: response[0].get("Email"),
          firstName: response[0].get("First Name"),
          lastName: response[0].get("Last Name"),
        }
        callback(null, formattedResponse);
      }
      callback(null, {managerId: null});
    } catch(e) {}
  })
}

async function setPropertyOwner(updateArray, callback) {
  base('listings').update(updateArray, function(error, response) {
    if(error){
      console.log("There was an error setting the property owner");
      callback(error, null);
    } else {
      callback(null, response);
    }
  })
}

async function getAllManagers(callback) {
  base('hostaway-integration').select().all((error, response) => {
    try{
      if(error){
        console.log("There was an error trying to get manager", error);
        callback(error, null);
      }
      if(response.length > 0){
        const formattedResponse = response.map((manager) => {
          return {
            airtableId: manager.id,
            managerId: manager.get("ID Property Manager"),
            token: manager.get("Token"),
            email: manager.get("Email"),
            firstName: manager.get("First Name"),
            lastName: manager.get("Last Name"),
            secret: manager.get("Secret"),
            hostawayId: manager.get("ID Hostaway"),
          }
        });
        callback(null, formattedResponse);
      }
      callback(null, []);
    } catch(e) {}
  })
}

module.exports = {
  postListings,
  postListing,
  getListings,
  postReportData,
  postManagerHostawayIntegration,
  setAccessToken,
  getUserIntegration,
  getManager,
  getReportData,
  setPropertyOwner,
  getAllManagers,
};

