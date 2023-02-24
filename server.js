const express = require('express'); //Line 1
const app = express(); //Line 2
const axios = require('axios');
require('dotenv').config();
const port = process.env.PORT || 5000; //Line 3

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
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