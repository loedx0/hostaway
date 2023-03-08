const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'patDvsWp9XhsDlAHq.cd8eb50aa23dc53594cd72e5c174276a83f354322386a5052750fb07587cdd26' }).base('appiAQlskdhkqvGi5');
// const base = new Airtable({apiKey: 'keyFvlhZwWyCrAKS4'}).base("appa8Kj9qD3QLzOdD");

const fields = {
    id: 'ID',
    address: 'Address',
    city: 'City',
    state: 'State',
    countryCode: 'Country Code',
    managerId: "ID Property Manager",
  };

  async function postListings(managerId, propertylist) {
    propertylist?.forEach(property => {
    base('tbldeBq4ZZWIm0DZq').create({
      // base('properties').create({
          [fields.id]: property.id ,
          [fields.address]: property.address,
          [fields.city]: property.city,
          [fields.state]: property.state,
          [fields.countryCode]: property.countryCode,
          [fields.managerId]: managerId
        }, function(err, record) {
          if (err) { console.error(err); return; }
        }
      );
    });
  }

  async function getListings(managerId, responseCallback) {
    base('properties').select().all((error, records) => {
      if(error) {
        console.log("Airtable returned error", error);
        responseCallback(error, null);
      }
      const formattedRecords = records.map((listing) => ({
        id: listing.get("ID"),
        address: listing.get("Address"),
        city: listing.get("City"),
        state: listing.get("State"),
        countryCode: listing.get("Country Code"),
        managerId
      }));
      responseCallback(null, formattedRecords);
    });
  }

  module.exports = {
    postListings,
    getListings,
};

