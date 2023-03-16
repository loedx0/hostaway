const express = require('express');
const cron = require('node-cron');
require('dotenv').config();
const app = express();
const air = require('./airtableService.js');
const hostaway = require('./hostawayService.js');
const household = require('./householdService.js');

app.use(express.json());
const port = process.env.PORT || 5002;

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
        // if(listing.countryCode === "US"){
          const address = listing.address+' '+listing.city+' '+listing.state+' '+listing.zipcode;
          await household.postListing(managerId, address, listing.countryCode, async function(errorHousehold, householdListingId) {
            if(errorHousehold) {
              console.log("This listing failed", listing);
              res.send({ message: "There was an error posting listings to Household", error: errorHousehold});
              return;
            }
            console.log("printing listing ID from household", householdListingId);
            await air.postListing(managerId, householdListingId, listing);
          })
        // } else {
        //   console.log("listing not for household", listing);
        //   await air.postListing(managerId, -1, listing);
        // }
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


//Functions for cron jobs
const cronUpdateAllTokens = async (req, res) => {
  await air.getAllManagers(function(error, response) {
    if(error) {
      console.log("There was an error getting all managers", error);
      if(res) res.send({error: error});
      return;
    }
    if(response.length > 0){
      response.forEach( async (manager) => {
        console.log(`Renewing access token for ${manager.firstName} ${manager.lastName}`);
        await hostaway.getAccessToken(
          manager.hostawayId,
          manager.secret,
          async function(error, token) {
            if(error) {
              if(res) res.send({ "There was an error obtaining hostaway accesstoken": error});
              return;
            }
            await air.setAccessToken(manager.airtableId, token, function(error, response) {
              try{
                if(error) {
                  console.log("There was an error setting new token in airtable", error);
                  if(res) res.send({ "There was an error setting in airtable the new accesstoken": error});
                  return;
                }
                console.log("Token updated successfully");
                if(res) res.send({result: "Tokens updated"});
              } catch(e) {}
            })
          }
        )
      });
    }
  })
}

const cronSaveAllListingsReports = async (req, res) => {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  // Setting the day to 0 gets the last day from the month before this month;
  const toLastDate = new Date(thisYear, thisMonth, 0).toISOString().slice(0,10);
  const fromLastDate = new Date(thisYear, thisMonth - 1, 1).toISOString().slice(0,10);
  const fromDate = req ? req.query['from_date'] || fromLastDate : fromLastDate;
  const toDate = req ? req.query['to_date'] || toLastDate : toLastDate;

  await air.getAllManagers(function(error, managers) {
    if(error) {
      console.log("There was an error getting all managers", error);
      // if(res) res.send({error: error});
      return;
    }
    if(managers.length > 0){
      managers.forEach( async (manager) => {
        console.log(`Getting all reports for ${manager.firstName} ${manager.lastName}`);
        try{
        await air.getListings(manager.managerId, false, async function(error, listings) {
          if(error) {
            // if(res) res.send({message: "There was an error reading from Airtable", error: error});
            return;
          }
          listings.forEach( async(listing) => {
            await hostaway.getConsolidationReport(
              manager.token,
              listing.id,
              listing.address,
              fromDate,
              toDate,
              async function(error, response) {
                if(error) {
                  // if(res) res.send({ message: "There was an error getting data from Hostaway", error: error});
                  return;
                }
                if(!response) {
                  // if(res) res.send({error: "No listing was found"});
                  return;
                }
                if(listing.householdId){
                  await household.postReportData(
                    manager.managerId,
                    listing.id,
                    listing.householdId,
                    parseFloat(response.totalPmCommission),
                    parseFloat(response.totalRentalRevenue),
                    fromDate,
                    async function(error, result) {
                      if(error) {
                        console.log("There was an error posting report data to Household", error);
                        return;
                      }
                      console.log(`Saving report for listing ${listing.id} with Household Id ${listing.householdId}`);
                      await air.postReportData(manager.managerId, listing.id, response);
                    }
                  );
                } else {
                  await air.postReportData(manager.managerId, listing.id, response);
                }
              })
            })
            // if(res) res.send({message: "Saved consolidation report for listings", results: listings});
        })
        } catch(e) {}
      });
    }
  })
}

cron.schedule("10 30 1 1 * *", function() {
  // To run 1:30:10 every 1st of each month
  console.log("Running monthly job to get all listings Report Data");
  cronSaveAllListingsReports(null, null);
});

cron.schedule("30 5 1 1 * *", function() {
  // To run 1:05:30 every 1st of each month
  console.log("Running monthly job to update access tokens");
  cronUpdateAllTokens(null, null);
});

// Testing cron job
// cron.schedule("* * * * * *", function() {
//   const thisMonth = new Date().getMonth();
//   const thisYear = new Date().getFullYear();
//   // Setting the day to 0 gets the last day from the month before this month;
//   const toDate = new Date(thisYear, thisMonth, 0).toISOString().slice(0,10);
//   const fromDate = new Date(thisYear, thisMonth - 1, 1).toISOString().slice(0,10);
//   console.log("Server datetime is:", new Date());
//   console.log(fromDate);
//   console.log(toDate);
// });

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

// To test cron jobs
app.get('/job/update_tokens', (req, res) => {cronUpdateAllTokens(req, res)});
// example: http://localhost:5002/job/save_reports?from_date=2023-01-01&to_date=2023-01-31
app.get('/job/save_reports', (req, res) => {cronSaveAllListingsReports(req, res)});
