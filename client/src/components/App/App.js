import React, { useState, useMemo, useEffect } from 'react';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Toolbar,
  TableContainer,
  TableBody,
  Table,
  Modal,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import logo from './logo.svg';
import './App.css';
import HostAuthToken from '../Services/HostAuthToken';
import getConsolidationReport, {formatReportData, formatReportColumns} from '../Services/HostConsolidationReport';
import reportDataAPI from '../Table/ReportData';

//OLD APP(){} FOR TESTING
  // const[propertieslist, setpropertieslist] = useState([]);
  // const [reportData, setReportData] = useState(null);
  // const [reportColumns, setReportColumns] = useState([]);

  // const handleOnClickPresionalo = async (e) => {
  //     e.preventDefault();
  //     const list = await HostAuthToken(setpropertieslist) ;
  //     console.log(list);
  // }

  // const handleConsolidationReport = () => {
  //   // getConsolidationReport(setReportData);
  //   const reportDataFormatted = reportDataAPI.data.map((entry) => formatReportData(entry));
  //   const totalsFormatted = formatReportData(reportDataAPI.totals);
  //   console.log("printing values", reportDataAPI.columns);
  //   console.log("printing values inside", reportDataFormatted[0]);

  //   setReportData({
  //     columns: reportDataAPI.columns,
  //     data: [totalsFormatted, ...reportDataFormatted]
  //   });
  //   console.log("printing result columns", reportDataAPI.columns[0]);
  // }

  // const columns = useMemo(
  //   () => formatReportColumns(reportData?.columns),
  //   [reportData]
  // );

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} style={{maxHeight: "10vh"}} className="App-logo" alt="logo" />
  //       <button style={{marginTop:'5%'}} onClick={handleOnClickPresionalo}>Presioname</button>
  //       <div style={{marginBottom: "-32px"}}>
  //         {propertieslist?.map((property)=>(
  //           <span key={property.id} style={{fontSize: "5px", margin: "3px"}}>{property.id}</span>
  //         ))}
  //       </div>
  //     </header>
  //     <div className="App-body">
  //       <span>Hello there</span>
  //       <button onClick={handleConsolidationReport}>Ver consolidacion</button>
  //     </div>
  //       {reportData?
  //       <Table columns={columns} data={reportData?.data} />
  //       :null}
  //   </div>
  // );

const styles = {
  mainStyle: {
    width: "100%", marginLeft:"auto", marginRight:"auto", marginBottom: "10px",
  },
  backBtn: {
    marginBottom: "10px", display: "block"
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
}

function createListingsData(id, address, city, state, country, zipcode, owner, householdId) {
  return {
    id,
    address,
    city,
    state,
    country,
    zipcode,
    owner,
    householdId,
  };
};

const headListingsCells = [
    {
      id: "id",
      numeric: true,
      disablePadding: true,
      label: "Hostaway ID",
    },
    {
      id: "address",
      numeric: false,
      disablePadding: false,
      label: "Address",
    },
    {
      id: "city",
      numeric: false,
      disablePadding: false,
      label: "City",
    },
    {
      id: "state",
      numeric: false,
      disablePadding: false,
      label: "State",
    },
    {
      id: "country",
      numeric: false,
      disablePadding: false,
      label: "Country Code",
    },
    {
      id: "zipcode",
      numeric: true,
      disablePadding: false,
      label: "ZipCode",
    },
    {
      id: "owner",
      numeric: false,
      disablePadding: false,
      label: "Property Owner",
    },
  ];

function EnhancedTableHead(props) {
  const {onSelectAllClick, numSelected, rowCount} = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all listings',
            }}
          />
        </TableCell>
        {headListingsCells?.map(headCell => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = (props) => {
  const { numSelected, selectedListings, handleCallback, forReports } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          Properties (Listings)
        </Typography>
      )}
      {numSelected > 0 && !forReports ? (
        <Button variant='outlined' onClick={() => handleCallback(selectedListings)}>Set Owner</Button>
      ) : null}
      {numSelected > 0 && forReports ? (
        <Button variant='outlined' onClick={() => handleCallback(selectedListings)}>Import reports</Button>
      ) : null}
    </Toolbar>
  );
};

function App() {
  const { promiseInProgress } = usePromiseTracker();

  const [managerEmailInput, setManagerEmailInput] = useState("");
  const [managerData, setManagerData] = useState();
  const [showComponent, setShowComponent] = useState("start");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [companyIdentifierInput, setCompanyIdentifierInput] = useState("");
  const [hostawayIdInput, setHostawayIdInput] = useState("");
  const [hostawaySecretInput, setHostawaySecretInput] = useState("");
  const [managerListings, setManagerListings] = useState([]);
  // const [listingTableData, setListingTableData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showNewOwnerModal, setShowNewOwnerModal] = useState(false);
  const [propertyOwnerName, setPropertyOwnerName] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");
  const [reportCounter, setReportCounter] = useState(-1);

  const startOver = () => {
    setShowComponent("start");
    setManagerData(null);
    setManagerEmailInput("");
    setManagerListings([]);
    // setFirstNameInput("");
    // setLastNameInput("");
    // setCompanyInput("");
    // setCompanyIdentifierInput("");
    // setHostawayIdInput("");
    // setHostawaySecretInput("");
  }

  const validateManager = (managerObj) => {
    console.log("manager obj", managerObj);
    if(managerObj.managerId){
      console.log("this is the manager id", managerObj.managerId);
      setManagerData(managerObj);
      if(!managerObj.token){
        setShowComponent("token");
        console.log("printing should add token to manager");
      } else {
        setShowComponent("options");
      }
    } else {
      setShowComponent("manager");
      console.log("there is no one with that mail");
    }
  }

  const checkEmail = () => {
    trackPromise(
    fetch('/get_manager?email='+managerEmailInput)
    .then(response => response.json())
    .then(result => validateManager(result.result))
    .catch(error => console.log("printing error", error))
    )
  }

  const createManager = () => {
    trackPromise(
    fetch('/post_user_integration', {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: managerEmailInput,
        firstName: firstNameInput,
        lastName: lastNameInput,
        company: companyInput,
        identifier: companyIdentifierInput,
        clientId: hostawayIdInput,
        secret: hostawaySecretInput,
      })
    })
    .then(response => response.json())
    .then(body => {
      console.log("pritnign body data from set user", body.result)
      if(body.result){
        setManagerData(body.result);
        setShowComponent("options");
      }
    })
    .catch(error => console.log("printing error", error))
    )
  }

  const getReportData = () => {
    trackPromise(
    fetch('/airtable/get_report_data?manager_id='+managerData.managerId)
    .then(response => response.json())
    .then(data => {
      console.log("printing data rows", data.rows);
      if(data.rows.length > 0){
        const sortedRows = data.rows;
        sortedRows.sort((pa, pb) => pa.listingId < pb.listingId);
        console.log("priknting rows", sortedRows);
      } else {
        setSnackMessage("No reports to show");
      }
    })
    .catch(error => console.log("Error getting report data", error))
    )
  }

  const getListings = () => {
    trackPromise(
    fetch('/airtable/get_listings?manager_id='+managerData.managerId)
    .then(response => response.json())
    .then(data => {
      console.log("printing listings", data.listings);
      const sortedListings = data.listings;
      sortedListings.sort((pa, pb) => pa.countryCode.localeCompare(pb.countryCode) * -1);
      setManagerListings(sortedListings);
      setShowComponent('listings');
    })
    .catch(error => console.log("Error getting listings", error))
    )
  }

  const goBack = () => {
    setShowComponent("options");
    setSelected([]);
  }

  const showHeader = () => {
    return (
      <Box>
        <Typography sx={{width: "fit-content"}} variant="body2">(Now as: {managerData.firstName} {managerData.lastName})</Typography>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
          <Button sx={showComponent === "options" ? styles.backBtn : {}} variant='outlined' size='small' onClick={startOver} color="error">Change Manager</Button>
          {showComponent !== "options" ?
            <Button sx={{}} variant='outlined' size='small' onClick={goBack} color="secondary">&#8592; Back</Button>
          : null}
        </Box>
      </Box>
    )
  }

  const handleSetOwner = (selected) => {
    console.log("printing selected listings", selected);
    setShowNewOwnerModal(true);
  }

  const saveNewOwner = () => {
    console.log("selected:", selected);
    console.log("new owner:", propertyOwnerName);
    setSelected([]);
    setShowNewOwnerModal(false);
  }

  const showImportReportData = () => {
    trackPromise(
    fetch('/airtable/get_listings?manager_id='+managerData.managerId)
    .then(response => response.json())
    .then(data => {
      console.log("printing listings", data.listings);
      const sortedListings = data.listings;
      sortedListings.sort((pa, pb) => pa.countryCode.localeCompare(pb.countryCode) * -1);
      setManagerListings(sortedListings);
      setShowComponent('reports');
    })
    .catch(error => console.log("Error getting listings", error))
    )
  }

  const importReportData = () => {
    console.log("selected:", selected);
    const selectedListings = managerListings.filter((sel) =>
      selected.filter(
        current => current ===sel.airtableId
      ).length
    )
    console.log("listings selected", selectedListings);
    console.log("from:", fromDateInput);
    console.log("to:", toDateInput);
    setReportCounter(selectedListings.length);
    selectedListings.forEach((listing) => {
      trackPromise(
      fetch('/consolidation_report', {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: managerData.token,
          managerId: managerData.managerId,
          listingId: listing.id,
          address: listing.address,
          fromDateInput,
          toDateInput,
        })
      })
      .then(response => response.json())
      .then(() => {})
      .catch(error => console.log("Error getting report", error))
      )
    })
  }

  const importListings = () => {
    console.log("hello there");
    trackPromise(
    fetch('/import_listings', {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: managerData.token,
        managerId: managerData.managerId,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("printing imported listings", data.new_listings);
      if(data.new_listings.length > 0){
        getListings();
        setShowComponent('listings');
      } else {
        setSnackMessage("Already updated");
      }
    })
    .catch(error => console.log("Error getting listings", error))
    )
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = managerListings?.map((n) => n.airtableId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackMessage("");
  };

  useEffect(() => {
    console.log("printing reportCounter", reportCounter);
    console.log("printing promise tracker", promiseInProgress);
    if(reportCounter > 0 && !promiseInProgress){
      setSelected([])
      setSnackMessage("Reportes descargados correctamente");
      setShowComponent("options");
      setReportCounter(-1);
    }
  }, [reportCounter, promiseInProgress])

  return (
    <div className="App">
      <div className="App-body">
        <Paper sx={{padding: "30px", maxWidth: "80vw"}}>
        {showComponent === "start" ?
          <Box>
            <Typography sx={styles.mainStyle} variant="h5">Enter Property Manager email</Typography>
            <TextField sx={styles.mainStyle} label="Email" variant='filled' size='small' value={managerEmailInput} onChange={(ev)=> setManagerEmailInput(ev.target.value)} />
            <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={checkEmail} disabled={promiseInProgress}>{promiseInProgress ? "Loading" : "Check Manager"}</Button>
          </Box>
        : null}
        {showComponent === "token" ?
          <Box>
            <Button sx={{marginBottom: "10px", display: "block"}} variant='outlined' size='small' onClick={startOver} color="secondary"> &#8592; Start Over</Button>
            <Typography sx={styles.mainStyle} variant="h5">Click the button to generate Access Token for Hostaway Integration</Typography>
            <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={()=>{}}>Renew Token</Button>
          </Box>
        : null}
        {showComponent === "manager" ?
          <Box>
            <Button sx={styles.backBtn} variant='outlined' size='small' onClick={startOver} color="secondary"> &#8592; Start Over</Button>
            <Typography sx={styles.mainStyle} variant="h5">A manager with <i>{managerEmailInput}</i> doesn't exist, you should create it</Typography>
            <TextField sx={styles.mainStyle} label="Email" variant='filled' size='small' value={managerEmailInput} disabled/>
            <TextField sx={styles.mainStyle} label="First Name" variant='filled' size='small' value={firstNameInput} onChange={(ev)=> setFirstNameInput(ev.target.value)} />
            <TextField sx={styles.mainStyle} label="Last Name" variant='filled' size='small' value={lastNameInput} onChange={(ev)=> setLastNameInput(ev.target.value)} />
            <TextField sx={styles.mainStyle} label="Company Name" variant='filled' size='small' value={companyInput} onChange={(ev)=> setCompanyInput(ev.target.value)} />
            <TextField sx={styles.mainStyle} label="Company Identifier" placeholder="company_identifier_#" variant='filled' size='small' value={companyIdentifierInput} onChange={(ev)=> setCompanyIdentifierInput(ev.target.value)} />
            <TextField sx={styles.mainStyle} label="Hostaway Client ID" placeholder='11111' variant='filled' size='small' value={hostawayIdInput} onChange={(ev)=> setHostawayIdInput(ev.target.value)} />
            <TextField sx={styles.mainStyle} label="Hostaway Secret" placeholder='886xx3xxxxdxxxxx3xxxx9xxxxdxxxx1xxxx1xxxx0xxxx8xxxx9xxxx330axxxf' variant='filled' size='small' value={hostawaySecretInput} onChange={(ev)=> setHostawaySecretInput(ev.target.value)} />
            <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={createManager} disabled={promiseInProgress}>{promiseInProgress ? "Loading" : "Create Manager"}</Button>
          </Box>
        : null}
        {showComponent === "options" ?
          <Box>
            {showHeader()}
            <Typography sx={styles.mainStyle} variant="h5">Click an option</Typography>
            <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={getListings} disabled={promiseInProgress}>{promiseInProgress ? "Loading" : "See Properties (listings)"}</Button>
            <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={getReportData} disabled={promiseInProgress}>{promiseInProgress ? "Loading" : "See Saved Reports"}</Button>
            <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={showImportReportData} disabled={promiseInProgress}>{promiseInProgress ? "Loading" : "Import Reports"}</Button>
          </Box>
        : null}
        {showComponent === "listings" ?
          <Box>
            {showHeader()}
            <EnhancedTableToolbar numSelected={selected.length} selectedListings={selected} handleCallback={handleSetOwner} forReports={false} />
            <TableContainer>
              {managerListings.length > 0 ?
                <Box>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      onSelectAllClick={handleSelectAllClick}
                      rowCount={managerListings.length}
                    />
                    <TableBody>
                      {managerListings?.map((listing, index) =>{
                        const isItemSelected = isSelected(listing.airtableId);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, listing.airtableId)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={listing.airtableId}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              align="right"
                            >
                             {listing.householdId ?
                              <Tooltip title="Synchronized with Household"><Button size='small' variant="text" color='inherit'>&#8635; {listing.id}</Button></Tooltip>
                              : listing.id}
                            </TableCell>
                            <TableCell align="right">{listing.address}</TableCell>
                            <TableCell align="right">{listing.city}</TableCell>
                            <TableCell align="right">{listing.state}</TableCell>
                            <TableCell align="right">{listing.countryCode}</TableCell>
                            <TableCell align="right">{listing.zipcode}</TableCell>
                            <TableCell align="right">{listing.owner}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={importListings} disabled={promiseInProgress}>{promiseInProgress ? "Loading" : "Update Properties from Hostaway"}</Button>
                </Box>
              :
                <Box>
                  <Typography variant='h5'>There are no Listings for this manager</Typography>
                  <Typography variant="body1">You should import them from hostaway</Typography>
                  <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={importListings} disabled={promiseInProgress}>{promiseInProgress ? "Loading" : "Do Automatic Import"}</Button>
                </Box>
              }
            </TableContainer>
          </Box>
        : null}
        {showComponent === "reports" ?
          <Box>
            {showHeader()}
            <Typography sx={styles.mainStyle} variant="h5">Input dates and select properties to get report data</Typography>
            <Box sx={{display: "flex"}}>
              <TextField sx={{marginRight: "20px", marginLeft: "auto", display: "flex"}} label="Date From" placeholder='2023-01-30' variant='filled' size='small' value={fromDateInput} onChange={(ev)=> setFromDateInput(ev.target.value)}/>
              <TextField sx={{marginRight: "auto", marginLeft: "20px", display: "flex"}} label="Date To" placeholder='2023-01-30' variant='filled' size='small' value={toDateInput} onChange={(ev)=> setToDateInput(ev.target.value)} />
            </Box>
            <EnhancedTableToolbar numSelected={selected.length} selectedListings={selected} handleCallback={importReportData} forReports={true} />
            <TableContainer>
              {managerListings.length > 0 ?
                <Box>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      onSelectAllClick={handleSelectAllClick}
                      rowCount={managerListings.length}
                    />
                    <TableBody>
                      {managerListings?.map((listing, index) =>{
                        const isItemSelected = isSelected(listing.airtableId);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, listing.airtableId)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={listing.airtableId}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              align="right"
                            >
                             {listing.householdId ?
                              <Tooltip title="Synchronized with Household"><Button size='small' variant="text" color='inherit'>&#8635; {listing.id}</Button></Tooltip>
                              : listing.id}
                            </TableCell>
                            <TableCell align="right">{listing.address}</TableCell>
                            <TableCell align="right">{listing.city}</TableCell>
                            <TableCell align="right">{listing.state}</TableCell>
                            <TableCell align="right">{listing.countryCode}</TableCell>
                            <TableCell align="right">{listing.zipcode}</TableCell>
                            <TableCell align="right">{listing.owner}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              :
                <Box>
                  <Typography variant='h5'>There are no Listings for this manager</Typography>
                  <Typography variant="body1">You should import them from hostaway</Typography>
                </Box>
              }
            </TableContainer>
          </Box>
        : null}
        </Paper>
        <Modal
          open={showNewOwnerModal}
          onClose={() => setShowNewOwnerModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styles.modal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              New Property Owner
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Enter the name of the Properties' Owner
            </Typography>
            <TextField sx={styles.mainStyle} label="Property Owner Name" placeholder='John Doe' variant='filled' size='small' value={propertyOwnerName} onChange={(ev)=> setPropertyOwnerName(ev.target.value)} />
            <Button sx={styles.mainStyle} variant='outlined' size='medium' onClick={saveNewOwner}>Save</Button>
          </Box>
        </Modal>
        <Snackbar
          open={snackMessage !== ""}
          autoHideDuration={6000}
          onClose={handleSnackClose}
          message={snackMessage}
        />
      </div>
    </div>
  );
}

export default App;
