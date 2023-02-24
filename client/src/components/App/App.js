import React, { useState, useMemo, useEffect } from 'react';
import Table from '../Table/Table';
import logo from './logo.svg';
import './App.css';
import HostAuthToken from '../Services/HostAuthToken';
import getConsolidationReport from '../Services/HostConsolidationReport';
import reportDataAPI from '../Table/ReportData';

function App() {
  const[propertieslist, setpropertieslist] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [reportColumns, setReportColumns] = useState([]);

  const handleOnClickPresionalo = async (e) => {
      e.preventDefault();
      const list = await HostAuthToken(setpropertieslist) ;
      console.log(list);
  }

  const handleConsolidationReport = () => {
    // getConsolidationReport(setReportData);
    const reportDataFormatted = reportDataAPI.data.map((entry) => ({
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
    }));

    const totalsFormatted = {
      id: reportDataAPI.totals[0],
      // reserveId: reportDataAPI.totals[1],
      guest: reportDataAPI.totals[2],
      channel: reportDataAPI.totals[3],
      status: reportDataAPI.totals[4],
      // payment: reportDataAPI.totals[5],
      paid: reportDataAPI.totals[6],
      arrival: reportDataAPI.totals[7],
      departure: reportDataAPI.totals[8],
      // unitId: reportDataAPI.totals[9],
      // unitName: reportDataAPI.totals[10],
      listing: reportDataAPI.totals[11],
      reserveDate: reportDataAPI.totals[12],
      guestFees: reportDataAPI.totals[13],
      tax: reportDataAPI.totals[14],
      rental: reportDataAPI.totals[15],
      commission: reportDataAPI.totals[16],
      ownerPayout: reportDataAPI.totals[17],
      cleaningChampYami: reportDataAPI.totals[18],
      nohemi: reportDataAPI.totals[19],
      commission8: reportDataAPI.totals[20],
      superHost: reportDataAPI.totals[21],
      baseRate: reportDataAPI.totals[22],
      // priceForExtra: reportDataAPI.totals[23],
      cleaningFee: reportDataAPI.totals[24],
      // additionalCleaningFee: reportDataAPI.totals[25],
      // parkingFee: reportDataAPI.totals[26],
      // towelChangeFee: reportDataAPI.totals[27],
      // midstayCleaningFee: reportDataAPI.totals[28],
      // roomRequestFee: reportDataAPI.totals[29],
      // reservationChangeFee: reportDataAPI.totals[30],
      // checkinFee: reportDataAPI.totals[31],
      // lateCheckoutFee: reportDataAPI.totals[32],
      // otherFees: reportDataAPI.totals[33],
      // creditCardFee: reportDataAPI.totals[34],
      // kitchenLinenFee: reportDataAPI.totals[35],
      // linenPackageFee: reportDataAPI.totals[36],
      // transferFee: reportDataAPI.totals[37],
      // wristbandFee: reportDataAPI.totals[38],
      // extraBedsFee: reportDataAPI.totals[39],
      // serviceFee: reportDataAPI.totals[40],
      // bedLinenFee: reportDataAPI.totals[41],
      // bookingFee: reportDataAPI.totals[42],
      // petFee: reportDataAPI.totals[43],
      skiPassFee: reportDataAPI.totals[44],
      tourismFee: reportDataAPI.totals[45],
      childrenExtraFee: reportDataAPI.totals[46],
      resortFee: reportDataAPI.totals[47],
      cityTax: reportDataAPI.totals[48],
      hotelTax: reportDataAPI.totals[49],
      lodgingTax: reportDataAPI.totals[50],
      roomTax: reportDataAPI.totals[51],
      salesTax: reportDataAPI.totals[52],
      propertyRentTax: reportDataAPI.totals[56],
      guestNightlyTax: reportDataAPI.totals[59],
      damageDeposit: reportDataAPI.totals[68],
      subtotalPrice: reportDataAPI.totals[74],
      managementFeeAirbnb: reportDataAPI.totals[76],
      insuranceFee: reportDataAPI.totals[81],
      airbnbPayoutSum: reportDataAPI.totals[84],
      nights: reportDataAPI.totals[88],
    };
    console.log("printing values", reportDataAPI.columns);
    console.log("printing values inside", reportDataFormatted[0]);

    setReportData({
      columns: reportDataAPI.columns,
      data: [totalsFormatted, ...reportDataFormatted]
    });
    console.log("printing result columns", reportDataAPI.columns[0]);
  }

  const columns = useMemo(
    () => [
      {
        Header: reportData?.columns[0].title,
        accessor: "id",
      },
      // {
      //   Header: reportData?.columns[1].title,
      //   accessor: "reserveId",
      // },
      {
        Header: reportData?.columns[2].title,
        accessor: "guest",
      },
      { Header: reportData?.columns[3].title,
      accessor: "channel"
      },
      { Header: reportData?.columns[4].title,
      accessor: "status"
      },
      // { Header: reportData?.columns[5].title,
      // accessor: "payment"
      // },
      { Header: reportData?.columns[6].title,
      accessor: "paid"
      },
      { Header: reportData?.columns[7].title,
      accessor: "arrival"
      },
      { Header: reportData?.columns[8].title,
      accessor: "departure"
      },
      // { Header: reportData?.columns[9].title,
      // accessor: "unitId"
      // },
      // { Header: reportData?.columns[10].title,
      // accessor: "unitName"
      // },
      { Header: reportData?.columns[11].title,
      accessor: "listing"
      },
      { Header: reportData?.columns[12].title,
      accessor: "reserveDate"
      },
      { Header: reportData?.columns[13].title,
      accessor: "guestFees"
      },
      { Header: reportData?.columns[14].title,
      accessor: "tax"
      },
      { Header: reportData?.columns[15].title,
      accessor: "rental"
      },
      { Header: reportData?.columns[16].title,
      accessor: "commission"
      },
      { Header: reportData?.columns[17].title,
      accessor: "ownerPayout"
      },
      { Header: reportData?.columns[18].title,
      accessor: "cleaningChampYami"
      },
      { Header: reportData?.columns[19].title,
      accessor: "nohemi"
      },
      { Header: reportData?.columns[20].title,
      accessor: "commission8"
      },
      { Header: reportData?.columns[21].title,
      accessor: "superHost"
      },
      { Header: reportData?.columns[22].title,
      accessor: "baseRate"
      },
      // { Header: reportData?.columns[23].title,
      // accessor: "priceForExtra"
      // },
      { Header: reportData?.columns[24].title,
      accessor: "cleaningFee"
      },
      // { Header: reportData?.columns[25].title,
      // accessor: "additionalCleaningFee"
      // },
      // { Header: reportData?.columns[26].title,
      // accessor: "parkingFee"
      // },
      // { Header: reportData?.columns[27].title,
      // accessor: "towelChangeFee"
      // },
      // { Header: reportData?.columns[28].title,
      // accessor: "midstayCleaningFee"
      // },
      // { Header: reportData?.columns[29].title,
      // accessor: "roomRequestFee"
      // },
      // { Header: reportData?.columns[30].title,
      // accessor: "reservationChangeFee"
      // },
      // { Header: reportData?.columns[31].title,
      // accessor: "checkinFee"
      // },
      // { Header: reportData?.columns[32].title,
      // accessor: "lateCheckoutFee"
      // },
      // { Header: reportData?.columns[33].title,
      // accessor: "otherFees"
      // },
      // { Header: reportData?.columns[34].title,
      // accessor: "creditCardFee"
      // },
      // { Header: reportData?.columns[35].title,
      // accessor: "kitchenLinenFee"
      // },
      // { Header: reportData?.columns[36].title,
      // accessor: "linenPackageFee"
      // },
      // { Header: reportData?.columns[37].title,
      // accessor: "transferFee"
      // },
      // { Header: reportData?.columns[38].title,
      // accessor: "wristbandFee"
      // },
      // { Header: reportData?.columns[39].title,
      // accessor: "extraBedsFee"
      // },
      // { Header: reportData?.columns[40].title,
      // accessor: "serviceFee"
      // },
      // { Header: reportData?.columns[41].title,
      // accessor: "bedLinenFee"
      // },
      // { Header: reportData?.columns[42].title,
      // accessor: "bookingFee"
      // },
      // { Header: reportData?.columns[43].title,
      // accessor: "petFee"
      // },
      { Header: reportData?.columns[44].title,
      accessor: "skiPassFee"
      },
      { Header: reportData?.columns[45].title,
      accessor: "tourismFee"
      },
      { Header: reportData?.columns[46].title,
      accessor: "childrenExtraFee"
      },
      { Header: reportData?.columns[47].title,
      accessor: "resortFee"
      },
      { Header: reportData?.columns[48].title,
      accessor: "cityTax"
      },
      { Header: reportData?.columns[49].title,
      accessor: "hotelTax"
      },
      { Header: reportData?.columns[50].title,
      accessor: "lodgingTax"
      },
      { Header: reportData?.columns[51].title,
      accessor: "roomTax"
      },
      { Header: reportData?.columns[52].title,
      accessor: "salesTax"
      },
      { Header: reportData?.columns[56].title,
      accessor: "propertyRentTax"
      },
      { Header: reportData?.columns[59].title,
      accessor: "guestNightlyTax"
      },
      { Header: reportData?.columns[68].title,
      accessor: "damageDeposit"
      },
      { Header: reportData?.columns[74].title,
      accessor: "subtotalPrice"
      },
      { Header: reportData?.columns[76].title,
      accessor: "managementFeeAirbnb"
      },
      { Header: reportData?.columns[81].title,
      accessor: "insuranceFee"
      },
      { Header: reportData?.columns[84].title,
      accessor: "airbnbPayoutSum"
      },
      { Header: reportData?.columns[88].title,
      accessor: "nights"
      },
    ],
    [reportData]
  );



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} style={{maxHeight: "10vh"}} className="App-logo" alt="logo" />
        <button style={{marginTop:'5%'}} onClick={handleOnClickPresionalo}>Presioname</button>
        <div style={{marginBottom: "-32px"}}>
          {propertieslist?.map((property)=>(
            <span key={property.id} style={{fontSize: "5px", margin: "3px"}}>{property.id}</span>
          ))}
        </div>
      </header>
      <div className="App-body">
        <span>Hello there</span>
        <button onClick={handleConsolidationReport}>Ver consolidacion</button>
      </div>
        {reportData?
        <Table columns={columns} data={reportData?.data} />
        :null}
    </div>
  );
}

export default App;
