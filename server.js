const express = require('express'); //Line 1
const app = express(); //Line 2
<<<<<<< HEAD
const port = process.env.PORT || 5001; //Line 3
const axios = require('axios');
=======
const axios = require('axios');
require('dotenv').config();
const port = process.env.PORT || 5000; //Line 3
>>>>>>> 2a1e4498610012c4cf80de2ef4ed543a218afb2b

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
<<<<<<< HEAD
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11

app.get('/consolidationreports', (req, res) => { //Line 9
  const url = 'https://api.hostaway.com/v1/finance/report/consolidated';
const options = {
  headers: {
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1MjkzNyIsImp0aSI6IjdmZjJlY2FjZTZlNDRiNTdkOGVmYWUxMWYwY2UxYmYwNDAyN2ZiOTNhOGE0OWYxNTVlZTgwMzEzZTUzZGNiMjhhNzY0YjQ3MmFiM2VlMWJjIiwiaWF0IjoxNjc3MDIyMDE0LCJuYmYiOjE2NzcwMjIwMTQsImV4cCI6MTc0MDE4MDQxNCwic3ViIjoiIiwic2NvcGVzIjpbImdlbmVyYWwiXSwic2VjcmV0SWQiOjEyNTE0fQ.cRgSb1bA2pC-zxZFSks7GZg_EJSZwithjrguLbWacVoNUu12tb0XfLfgCpZo61E20_6Y5GaefxHGEknFLuvG2lP_a2L6n7qgbcNl4tL8X9J_XKXU-oUIgdWKSGVTJCHf1CaT09yw6F5RZkmrA4lPDAua-KXEJSHArnsmCy82K6U`,
    'Cache-control': 'no-cache',
  },
  params: {
    format: 'json',
    fromDate: '2023-01-01',
    toDate: '2023-02-01',
    listingMapIds: [140052]
  },
};
  axios.post(url, options)
  .then((response) => {
      if(response.data.status === "success"){
        const tableData = response.data.result;
        console.log(tableData);
      } 
  })
  .catch((error) => {
      console.error(error);
  });
res.send({ express: 'These are the reports' }); //Line 10
}); //Line 11
=======
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT 2' }); //Line 10
}); //Line 11

app.get('/consolidation-report', (req, res) => {
  const url = 'https://api.hostaway.com/v1/finance/report/consolidated';
  const authType = 'Bearer';
  const authKey = process.env.API_KEY;
  const auth = authType+' '+authKey;
  axios.post(url, {
      format: 'json',
      fromDate: '2023-01-01',
      toDate: '2023-02-01',
      listingMapIds: [140052]
    }, {
    headers: {
      'Authorization': auth,
      "Content-type": "application/json",
    }})
    .then((response) => {
        if(response.data.status === "success"){
          const tableData = response.data.result;
          console.log(tableData);
          res.send({ tableData });
        }
    })
    .catch((error) => {
        console.error(error);
        res.send({ error });
    });
});

app.get('/property-data', (req, res) => {
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
  axios.get(url, options)
    .then((response) => {
        const properties = response.data.result.map((property)=>{
            return {
                id:property.id,
                address:property.address,
                city:property.city,
                state:property.state,
                zipcode:property.zipcode,
                countryCode:property.countryCode
            }
        }) ;
        console.log(properties);
        res.send({ properties });
    })
    .catch((error) => {
        console.error(error);
        res.send({ error });
    });

})
>>>>>>> 2a1e4498610012c4cf80de2ef4ed543a218afb2b
