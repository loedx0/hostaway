import axios from 'axios';

const url = 'https://api.hostaway.com/v1/listings';
const options = {
  headers: {
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1MjkzNyIsImp0aSI6IjdmZjJlY2FjZTZlNDRiNTdkOGVmYWUxMWYwY2UxYmYwNDAyN2ZiOTNhOGE0OWYxNTVlZTgwMzEzZTUzZGNiMjhhNzY0YjQ3MmFiM2VlMWJjIiwiaWF0IjoxNjc3MDIyMDE0LCJuYmYiOjE2NzcwMjIwMTQsImV4cCI6MTc0MDE4MDQxNCwic3ViIjoiIiwic2NvcGVzIjpbImdlbmVyYWwiXSwic2VjcmV0SWQiOjEyNTE0fQ.cRgSb1bA2pC-zxZFSks7GZg_EJSZwithjrguLbWacVoNUu12tb0XfLfgCpZo61E20_6Y5GaefxHGEknFLuvG2lP_a2L6n7qgbcNl4tL8X9J_XKXU-oUIgdWKSGVTJCHf1CaT09yw6F5RZkmrA4lPDAua-KXEJSHArnsmCy82K6U',
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
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
    
}

export default HostAuthToken ;