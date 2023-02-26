const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'patDvsWp9XhsDlAHq.cd8eb50aa23dc53594cd72e5c174276a83f354322386a5052750fb07587cdd26' }).base('appiAQlskdhkqvGi5');

const fields = {
    id: 'ID',
    address: 'Address',
    city: 'City',
    state: 'State',
    countryCode: 'Country Code',
  };

  module.exports = {
    functionAirtable: async function(propertylist){
    propertylist?.forEach(property => {
    base('tbldeBq4ZZWIm0DZq').create({
        [fields.id]: property.id ,
        [fields.address]: property.address,
        [fields.city]: property.city,
        [fields.state]: property.state,
        [fields.countryCode]: property.countryCode,
            }, function(err, record) {
            if (err) { console.error(err); return; }
            console.log(record.getId());
            });
    }
)},
};
  
