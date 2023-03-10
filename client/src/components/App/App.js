import React, { useState, useMemo, useEffect } from 'react';
import Table from '../Table/Table';
import logo from './logo.svg';
import './App.css';
import HostAuthToken from '../Services/HostAuthToken';
import getConsolidationReport, {formatReportData, formatReportColumns} from '../Services/HostConsolidationReport';
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
    const reportDataFormatted = reportDataAPI.data.map((entry) => formatReportData(entry));
    const totalsFormatted = formatReportData(reportDataAPI.totals);
    console.log("printing values", reportDataAPI.columns);
    console.log("printing values inside", reportDataFormatted[0]);

    setReportData({
      columns: reportDataAPI.columns,
      data: [totalsFormatted, ...reportDataFormatted]
    });
    console.log("printing result columns", reportDataAPI.columns[0]);
  }

  const columns = useMemo(
    () => formatReportColumns(reportData?.columns),
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
