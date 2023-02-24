const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5001; //Line 3
const axios = require('axios');

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
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