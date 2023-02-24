import axios from 'axios';

const url = 'https://api.hostaway.com/v1/finance/report/consolidated';
const options = {
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
    'Cache-control': 'no-cache',
  },
  params: {
    format: 'json',
    fromDate: '2023-01-01',
    toDate: '2023-02-01',
    listingMapIds: [140052]
  },
};

export default function getConsolidationReport (setReportData) {
    axios.post(url, options)
    .then((response) => {
        if(response.data.status === "success"){
          const tableData = response.data.result;
          console.log(tableData);
          setReportData(tableData);
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

