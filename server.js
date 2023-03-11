const express = require('express');
require('dotenv').config();
const app = express();
const air = require('./airtableService.js');
const hostaway = require('./hostawayService.js');
const household = require('./householdService.js');

app.use(express.json());
const port = process.env.PORT || 5001;

// Variables to manage for each function
const propertyManager = 345345;
const listingId = 140052;
const fromDateInput = '2023-01-01';
const toDateInput = '2023-02-01';
const secret = "8862230840d67d623b45f94af4d1c0119a54152cb0ceff8f9ce6cace330a200f";
const clientId = "52937";

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
    propertyManager,
    listingId,
    listingAddress,
    fromDateInput,
    toDateInput,
    function(error, response) {
      if(error) {
        res.send({ message: "There was an error getting data from Hostaway", error: error});
        return;
      }
      console.log("printing response", response);
      if(!response) {
        res.send({error: "No listing was found"});
        return;
      }
      console.log("printing before await");
      air.postReportData(managerId, listingId, response);
      res.send({result: response});
  })
};

const hostawayGetListings = async (req, res) => {
  await hostaway.getListings(async function(error, response) {
    if(error){
      res.send({ "There was an error getting listings from Hostaway": error});
      return;
    }
    await air.postListings(propertyManager, response);
    res.send({ express: 'air crobby' });
  })
};

const airtableGetListings = async (req, res) => {
  const managerId = req.query['manager_id'] || propertyManager;
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

const saveListings = async (req, res) => {
  const managerId = req.query['manager_id'] || propertyManager;
  await air.getListings(managerId, false, async function(errorAirtable, currentListings) {
    if(errorAirtable) {
      res.send({"There was an error reading from Airtable": errorAirtable});
      return;
    }
    await hostaway.getListings(async function(errorHostaway, properties) {
      if(errorHostaway) {
        res.send({ "There was an error getting listings from Hostaway": errorHostaway});
        return;
      }
      const newListings = properties.filter(
        newProp => !currentListings.filter(
          current => current.id === newProp.id
        ).length
      );
      await air.postListings(managerId, newListings);
      res.send({"These are the new listings": newListings});
    });
  });
};

const householdPostListings = async (req, res) => {
  await air.getListings(propertyManager, async function(error, results) {
    if(error) {
      res.send({"There was an error reading from Airtable": error});
      return;
    }
    const USProperties = results.filter((property) => property.countryCode === "US");
    const USPropsAddresses = USProperties.map((property) => {
      return {
        address: property.address
      }
    });
    console.log("These are the addresses only", USPropsAddresses);
    res.send({"These are the US only Listings": USProperties});
  });
}

const saveAllListingsReports = async (req, res) => {
  await air.getListings(propertyManager, async function(error, results) {
    if(error) {
      res.send({"There was an error reading from Airtable": error});
      return;
    }
    results.forEach( async(listing) => {
      await hostaway.getConsolidationReport(
        propertyManager,
        listing.id,
        listing.address,
        fromDateInput,
        toDateInput,
        async function(error, response) {
          if(error) {
            res.send({ "There was an error getting data from Hostaway": error});
            return;
          }
          if(!response) {
            res.send({error: "No listing was found"});
            return;
          }
          await air.postReportData(listingId, response);
        })
      })
    res.send({"Saved consolidation report for listings": results});
  })
}

const getAccessToken = async (req, res) => {
  await hostaway.getAccessToken(
    clientId,
    secret,
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
  const managerId = req.query['manager_id'] || propertyManager;
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1MjkzNyIsImp0aSI6ImY2MjJiNzE2MTk4YzBjMjg4OWExZDM1NGIyYjUwMmE0MWViY2U4ODBmNzlmZmVhODQ1YTAxMmI2OWY1MzliOTVmNTRiZDVmMDM5ZDcwYzM2IiwiaWF0IjoxNjc4Mzg5MjkxLCJuYmYiOjE2NzgzODkyOTEsImV4cCI6MTc0MTU0NzY5MSwic3ViIjoiIiwic2NvcGVzIjpbImdlbmVyYWwiXSwic2VjcmV0SWQiOjEyNTE0fQ.hL640wE8Rmgu4UpPR8VIF1onQTO6_Key3rUO5mlxQDbuH78e9yepDwsH0XQjN4iq-7yeVOglLJbpwzx7QnkMZomEv2GT44Nu0hL2WeXaOQQMzHrc1Lzo7LM2p4cuynpywjWUhp5FQZCNDh22nCt36DcLylFhM41xH5-Jujh76WE";
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

const setUserIntegration = async (req, res) => {
  // const managerId = req.query['manager_id'] || propertyManager;
  const hostawayClientId = req.query['client_id'] || clientId;
  const hostawaySecret = req.query['secret'] || secret;
  const email = req.query['email'] || "tester@testing.test";
  const company = req.query['company'] || 'Company TEST';
  const companyIdentifier = req.query['identifier'] || "company_test";
  const firstName = req.query['firstname'] || 'Tester';
  const lastName = req.query['lastname'] || "Testering";

  await household.postManager(
    company,
    companyIdentifier,
    email,
    firstName,
    lastName,
    async function(error, manager) {
      if(error) {
        res.send({"There was an error in Household creating a Property Manager": error});
        return;
      }
      console.log("printing outside manager", manager.data);
      await hostaway.getAccessToken(
        hostawayClientId,
        hostawaySecret,
        async function(error, token) {
          if(error) {
            res.send({ "There was an error obtaining hostaway accesstoken": error});
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
                res.send({"There was an error setting the new hostaway integration": error});
                return;
              }
              res.send({"New integration": response});
          })
        }
      )
  });
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


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));
// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});


// get manager info from airtable for integration with hostaway
app.get('/get_manager', (req, res) => {getManagerData(req, res)});
// get the consolidation report from hostaway (use it like /consolidation-report?listing={integer})
app.post('/consolidation_report', (req, res) => {importConsolidationReport(req, res)});
// airtable function to get listings from hostaway (saves every listing regardless if already exists)
//app.get('/hostaway/get_listings', (req,res) => {hostawayGetListings(req, res)});
// show listings saved in airtable
app.get('/airtable/get_listings', (req, res) => {airtableGetListings(req, res)});
// save new listings from hostaway in airtable
// app.get('/save_listings', (req, res) => {saveListings(req, res)});
// send saved US-only listings to household
app.get('/household/post_listings', (req, res) => {householdPostListings(req, res)});
// save reports from all listings from a manager
app.get('/save_reports', (req, res) => {saveAllListingsReports(req, res)});

// Example http://localhost:5001/set_user_integration?firstname=PMTester&lastname=Testerer&email=pm1@household.com&company=Company%C2%A0Test&identifier=company_test
app.get('/set_user_integration', (req, res) => {setUserIntegration(req, res)});
app.post('/post_user_integration', (req, res) => {postUserIntegration(req, res)});

app.get('/hostaway/get_token', (req, res) => {getAccessToken(req, res)});

// Example http://localhost:5001/set_token?manager_id=99999
app.get('/set_token', (req, res) => {setToken(req, res)});

app.post('/import_listings', (req, res) => {automatedListingsImport(req, res)});

app.get('/airtable/get_report_data', (req, res) => {getReportData(req, res)});