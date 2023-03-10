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

export function formatReportData(entry) {
  return {
    id: entry[0],
    // reserveId: entry[1],
    guest: entry[2],
    channel: entry[3],
    status: entry[4],
    // payment: entry[5],
    paid: entry[6],
    arrival: entry[7],
    departure: entry[8],
    // unitId: entry[9],
    // unitName: entry[10],
    listing: entry[11],
    reserveDate: entry[12],
    guestFees: entry[13],
    tax: entry[14],
    rental: entry[15],
    commission: entry[16],
    ownerPayout: entry[17],
    cleaningChampYami: entry[18],
    nohemi: entry[19],
    commission8: entry[20],
    superHost: entry[21],
    baseRate: entry[22],
    // priceForExtra: entry[23],
    cleaningFee: entry[24],
    // additionalCleaningFee: entry[25],
    // parkingFee: entry[26],
    // towelChangeFee: entry[27],
    // midstayCleaningFee: entry[28],
    // roomRequestFee: entry[29],
    // reservationChangeFee: entry[30],
    // checkinFee: entry[31],
    // lateCheckoutFee: entry[32],
    // otherFees: entry[33],
    // creditCardFee: entry[34],
    // kitchenLinenFee: entry[35],
    // linenPackageFee: entry[36],
    // transferFee: entry[37],
    // wristbandFee: entry[38],
    // extraBedsFee: entry[39],
    // serviceFee: entry[40],
    // bedLinenFee: entry[41],
    // bookingFee: entry[42],
    petFee: entry[43],
    skiPassFee: entry[44],
    tourismFee: entry[45],
    // childrenExtraFee: entry[46],
    resortFee: entry[47],
    cityTax: entry[48],
    hotelTax: entry[49],
    lodgingTax: entry[50],
    roomTax: entry[51],
    salesTax: entry[52],
    propertyRentTax: entry[56],
    guestNightlyTax: entry[59],
    damageDeposit: entry[68],
    subtotalPrice: entry[74],
    managementFeeAirbnb: entry[76],
    insuranceFee: entry[81],
    airbnbPayoutSum: entry[84],
    nights: entry[88],
    }
  }

  export function formatReportColumns (reportColumnsNames) {
    if(reportColumnsNames){
      return [
        {
          Header: reportColumnsNames[0].title,
          accessor: "id",
        },
        // {
        //   Header: reportColumnsNames[1].title,
        //   accessor: "reserveId",
        // },
        {
          Header: reportColumnsNames[2].title,
          accessor: "guest",
        },
        { Header: reportColumnsNames[3].title,
        accessor: "channel"
        },
        { Header: reportColumnsNames[4].title,
        accessor: "status"
        },
        // { Header: reportColumnsNames[5].title,
        // accessor: "payment"
        // },
        { Header: reportColumnsNames[6].title,
        accessor: "paid"
        },
        { Header: reportColumnsNames[7].title,
        accessor: "arrival"
        },
        { Header: reportColumnsNames[8].title,
        accessor: "departure"
        },
        // { Header: reportColumnsNames[9].title,
        // accessor: "unitId"
        // },
        // { Header: reportColumnsNames[10].title,
        // accessor: "unitName"
        // },
        { Header: reportColumnsNames[11].title,
        accessor: "listing"
        },
        { Header: reportColumnsNames[12].title,
        accessor: "reserveDate"
        },
        { Header: reportColumnsNames[13].title,
        accessor: "guestFees"
        },
        { Header: reportColumnsNames[14].title,
        accessor: "tax"
        },
        { Header: reportColumnsNames[15].title,
        accessor: "rental"
        },
        { Header: reportColumnsNames[16].title,
        accessor: "commission"
        },
        { Header: reportColumnsNames[17].title,
        accessor: "ownerPayout"
        },
        { Header: reportColumnsNames[18].title,
        accessor: "cleaningChampYami"
        },
        { Header: reportColumnsNames[19].title,
        accessor: "nohemi"
        },
        { Header: reportColumnsNames[20].title,
        accessor: "commission8"
        },
        { Header: reportColumnsNames[21].title,
        accessor: "superHost"
        },
        { Header: reportColumnsNames[22].title,
        accessor: "baseRate"
        },
        // { Header: reportColumnsNames[23].title,
        // accessor: "priceForExtra"
        // },
        { Header: reportColumnsNames[24].title,
        accessor: "cleaningFee"
        },
        // { Header: reportColumnsNames[25].title,
        // accessor: "additionalCleaningFee"
        // },
        // { Header: reportColumnsNames[26].title,
        // accessor: "parkingFee"
        // },
        // { Header: reportColumnsNames[27].title,
        // accessor: "towelChangeFee"
        // },
        // { Header: reportColumnsNames[28].title,
        // accessor: "midstayCleaningFee"
        // },
        // { Header: reportColumnsNames[29].title,
        // accessor: "roomRequestFee"
        // },
        // { Header: reportColumnsNames[30].title,
        // accessor: "reservationChangeFee"
        // },
        // { Header: reportColumnsNames[31].title,
        // accessor: "checkinFee"
        // },
        // { Header: reportColumnsNames[32].title,
        // accessor: "lateCheckoutFee"
        // },
        // { Header: reportColumnsNames[33].title,
        // accessor: "otherFees"
        // },
        // { Header: reportColumnsNames[34].title,
        // accessor: "creditCardFee"
        // },
        // { Header: reportColumnsNames[35].title,
        // accessor: "kitchenLinenFee"
        // },
        // { Header: reportColumnsNames[36].title,
        // accessor: "linenPackageFee"
        // },
        // { Header: reportColumnsNames[37].title,
        // accessor: "transferFee"
        // },
        // { Header: reportColumnsNames[38].title,
        // accessor: "wristbandFee"
        // },
        // { Header: reportColumnsNames[39].title,
        // accessor: "extraBedsFee"
        // },
        // { Header: reportColumnsNames[40].title,
        // accessor: "serviceFee"
        // },
        // { Header: reportColumnsNames[41].title,
        // accessor: "bedLinenFee"
        // },
        // { Header: reportColumnsNames[42].title,
        // accessor: "bookingFee"
        // },
        // { Header: reportColumnsNames[43].title,
        // accessor: "petFee"
        // },
        { Header: reportColumnsNames[44].title,
        accessor: "skiPassFee"
        },
        { Header: reportColumnsNames[45].title,
        accessor: "tourismFee"
        },
        { Header: reportColumnsNames[46].title,
        accessor: "childrenExtraFee"
        },
        { Header: reportColumnsNames[47].title,
        accessor: "resortFee"
        },
        { Header: reportColumnsNames[48].title,
        accessor: "cityTax"
        },
        { Header: reportColumnsNames[49].title,
        accessor: "hotelTax"
        },
        { Header: reportColumnsNames[50].title,
        accessor: "lodgingTax"
        },
        { Header: reportColumnsNames[51].title,
        accessor: "roomTax"
        },
        { Header: reportColumnsNames[52].title,
        accessor: "salesTax"
        },
        { Header: reportColumnsNames[56].title,
        accessor: "propertyRentTax"
        },
        { Header: reportColumnsNames[59].title,
        accessor: "guestNightlyTax"
        },
        { Header: reportColumnsNames[68].title,
        accessor: "damageDeposit"
        },
        { Header: reportColumnsNames[74].title,
        accessor: "subtotalPrice"
        },
        { Header: reportColumnsNames[76].title,
        accessor: "managementFeeAirbnb"
        },
        { Header: reportColumnsNames[81].title,
        accessor: "insuranceFee"
        },
        { Header: reportColumnsNames[84].title,
        accessor: "airbnbPayoutSum"
        },
        { Header: reportColumnsNames[88].title,
        accessor: "nights"
        },
      ];
    } else {
      return null;
    }
  }

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

