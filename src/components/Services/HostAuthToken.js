import axios from 'axios';

const url = 'https://api.hostaway.com/v1/listings';
const options = {
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
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

function HostAuthToken () {

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
    })
    .catch((error) => {
      console.error(error);
    });
    
}

export default HostAuthToken ;