const express = require('express');
require('dotenv').config();
const app = express();
const air = require('./airtableService.js');
const hostaway = require('./hostawayService.js');
const household = require('./householdService.js');

app.use(express.json());
const port = process.env.PORT || 5001;

// Variables to manage for each function
// const propertyManager = 345345;
// const listingId = 140052;
// const fromDateInput = '2023-01-01';
// const toDateInput = '2023-02-01';
// const secret = "8862230840d67d623b45f94af4d1c0119a54152cb0ceff8f9ce6cace330a200f";
// const clientId = "52937";

const importConsolidationReport = async (req, res) => {
  const reqBody  = req.body;
  if(!reqBody){
    res.send({error: "No data was send"});
    return;
  }
  const hostawayToken = reqBody.token;
  const managerId = reqBody.managerId;
  const listingId = reqBody.listingId;
  const listingAddress = reqBody.address;
  const fromDateInput = reqBody.fromDateInput;
  const toDateInput = reqBody.toDateInput;
  await hostaway.getConsolidationReport(
    hostawayToken,
    listingId,
    listingAddress,
    fromDateInput,
    toDateInput,
    function(error, response) {
      if(error) {
        res.send({ message: "There was an error getting data from Hostaway", error: error});
        return;
      }
      if(!response) {
        res.send({error: "No listing was found"});
        return;
      }
      air.postReportData(managerId, listingId, response);
      res.send({result: response});
  })
};

const airtableGetListings = async (req, res) => {
  const managerId = req.query['manager_id'];
  await air.getListings(managerId, false, function(error, result) {
    if(error) {
      res.send({"ocurrio un error" : error});
      return;
    }
    res.send({listings: result})
  })
};

const automatedListingsImport = async (req, res) => {
  const reqBody  = req.body;
  if(!reqBody){
    res.send({error: "No data was send"});
    return;
  }
  const hostawayToken = reqBody.token;
  const managerId = reqBody.managerId;
  await air.getListings(managerId, false, async function(errorAirtable, currentListings) {
    if(errorAirtable) {
      res.send({ message: "There was an error reading from Airtable", error: errorAirtable});
      return;
    }
    await hostaway.getListings(hostawayToken, async function(errorHostaway, properties) {
      if(errorHostaway) {
        res.send({ message: "There was an error getting listings from Hostaway", error: errorHostaway});
        return;
      }
      const newListings = properties.filter(
        newProp => !currentListings.filter(
          current => current.id === newProp.id
        ).length
      );
      newListings.forEach( async (listing) => {
        if(listing.countryCode === "US"){
          const address = listing.address+' '+listing.city+' '+listing.state+' '+listing.zipcode;
          await household.postListing(managerId, address, async function(errorHousehold, householdListingId) {
            if(errorHousehold) {
              console.log("This listing failed", listing);
              res.send({ message: "There was an error posting listings to Household", error: errorHousehold});
              return;
            }
            console.log("printing listing ID from household", householdListingId);
            await air.postListing(managerId, householdListingId, listing);
          })
        } else {
          console.log("printing listing not for household", listing);
          await air.postListing(managerId, -1, listing);
        }
      })
      res.send({"new_listings": newListings});
    });
  });
}

const saveAllListingsReports = async (req, res) => {
  const reqBody  = req.body;
  if(!reqBody){
    res.send({error: "No data was send"});
    return;
  }
  const hostawayToken = reqBody.token;
  const managerId = reqBody.managerId;
  const fromDateInput = reqBody.fromDateInput;
  const toDateInput = reqBody.toDateInput;
  await air.getListings(managerId, async function(error, results) {
    if(error) {
      res.send({message: "There was an error reading from Airtable", error: error});
      return;
    }
    results.forEach( async(listing) => {
      await hostaway.getConsolidationReport(
        hostawayToken,
        listing.id,
        listing.address,
        fromDateInput,
        toDateInput,
        async function(error, response) {
          if(error) {
            res.send({ message: "There was an error getting data from Hostaway", error: error});
            return;
          }
          if(!response) {
            res.send({error: "No listing was found"});
            return;
          }
          await air.postReportData(managerId, listing.id, response);
        })
      })
    res.send({message: "Saved consolidation report for listings", results: results});
  })
}

const getAccessToken = async (req, res) => {
  const reqBody  = req.body;
  if(!reqBody){
    res.send({error: "No data was send"});
    return;
  }
  const hostawayId = reqBody.clientId;
  const hostawaySecret = reqBody.secret;
  await hostaway.getAccessToken(
    hostawayId,
    hostawaySecret,
    function(error, response) {
      if(error) {
        res.send({ "There was an error obtaining hostaway accesstoken": error});
        return;
      }
      res.send({"This is your new access token": response});
    }
  )
}

const setToken = async (req, res) => {
  const reqBody  = req.body;
  if(!reqBody){
    res.send({error: "No data was send"});
    return;
  }
  const managerId = reqBody.managerId;
  const token = reqBody.token;
  await air.getUserIntegration(managerId, async function(error, response) {
    if(error) {
      res.send({"There was an error getting the user integration data": error});
      return;
    }
    await air.setAccessToken(response.airtableId, token, function(error, response) {
      if(error) {
        res.send({"There was an error setting the new token": error});
        return;
      }
      res.send({"This is the data for the user with the new token": response});
    });
  })
}

const postUserIntegration = async (req, res) => {
  const reqBody  = req.body;
  if(!reqBody){
    res.send({error: "No data was send"});
    return;
  }
  const hostawayClientId = reqBody.clientId;
  const hostawaySecret = reqBody.secret;
  const email = reqBody.email;
  const company = reqBody.company;
  const companyIdentifier = reqBody.identifier;
  const firstName = reqBody.firstName;
  const lastName = reqBody.lastName;

  await household.postManager(
    company,
    companyIdentifier,
    email,
    firstName,
    lastName,
    async function(error, manager) {
      if(error) {
        console.log("printing error", error);
        res.send({message: "There was an error in Household creating a Property Manager", error: error});
        return;
      }
      console.log("printing outside manager", manager.data);
      await hostaway.getAccessToken(
        hostawayClientId,
        hostawaySecret,
        async function(error, token) {
          if(error) {
            res.send({message:  "There was an error obtaining hostaway accesstoken", error: error});
            return;
          }
          await air.postManagerHostawayIntegration(
            manager.data.id_company_user,
            hostawayClientId,
            hostawaySecret,
            email,
            company,
            companyIdentifier,
            firstName,
            lastName,
            token,
            async function(error, response) {
              if(error) {
                res.send({message: "There was an error setting the new hostaway integration", error: error});
                return;
              }
              res.send({result: {
                managerId: manager.data.id_company_user,
                email,
                token,
                firstName,
                lastName
              }});
          })
        }
      )
  });
}

const getManagerData = async (req, res) =>{
  const email = req.query['email'] || "tester@testing.test";
  await air.getManager(email, function(error, manager) {
    if(error) {
      res.json({error : error});
      return;
    }
    res.send({result: manager});
  })
}

const getReportData = async (req, res) => {
  const managerId = req.query['manager_id'];
  await air.getReportData(managerId, function(error, response) {
    if(error) {
      res.json({error : error});
      return;
    }
    res.send({rows: response});
  })
}

const setPropertyOwner = async (req, res) => {
  const reqBody  = req.body;
  if(!reqBody){
    res.send({error: "No data was send"});
    return;
  }
  const listings = reqBody.listings;
  const ownerName = reqBody.ownerName;
  const updateArray = listings.map((listing) => {
    return {
      id: listing,
      fields: {
        "Property Owner": ownerName,
      }
    }
  });
  await air.setPropertyOwner(updateArray, function(error, response) {
    if(error) {
      res.json({error : error});
      return;
    }
    console.log("printing response owner", response);
    res.json({ result : response});
  })
}


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// get manager info from airtable for integration with hostaway
app.get('/get_manager', (req, res) => {getManagerData(req, res)});
// get the consolidation report from hostaway
app.post('/consolidation_report', (req, res) => {importConsolidationReport(req, res)});

// show listings saved in airtable
app.get('/airtable/get_listings', (req, res) => {airtableGetListings(req, res)});

// save reports from all listings from a manager
app.get('/save_reports', (req, res) => {saveAllListingsReports(req, res)});

app.post('/post_user_integration', (req, res) => {postUserIntegration(req, res)});

app.get('/hostaway/get_token', (req, res) => {getAccessToken(req, res)});

app.get('/set_token', (req, res) => {setToken(req, res)});

app.post('/import_listings', (req, res) => {automatedListingsImport(req, res)});

app.get('/airtable/get_report_data', (req, res) => {getReportData(req, res)});

app.post('/airtable/set_property_owner', (req, res) => {setPropertyOwner(req, res)});