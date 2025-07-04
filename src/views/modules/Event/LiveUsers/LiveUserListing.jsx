import React, { useMemo } from "react";
import CommonListing from "../CustomUtils/CommonListing";

const LiveUserListing = ({ data, loading,dateRange,setDateRange }) => {
  const columns = useMemo(
    () => [
      {
        dataField: "id",
        text: "#",
        formatter: (cell, row, rowIndex) => rowIndex + 1,
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "browser",
        text: "Browser",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "state",
        text: "state",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      //changed by hp2
      {
        dataField: "city",
        text: "city",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "ip_address",
        text: "IP Address",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        //lattitue and longitude
        dataField: "latitude",
        text: "Latitude",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "longitude",
        text: "Longitude",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "platform",
        text: "platform",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "device",
        text: "Device",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "",
        text: "Date",
        //format the date ? , format dd-mm-yyyy
        formatter: (cell, row) => {
          const date = new Date(row.created_at);
          return `${date.getDate()}-${
            date.getMonth() + 1
          }-${date.getFullYear()}`;
        },
        headerAlign: "center",
        align: "center",
        sort: true,
      },
    ],
    []
  );
  return (
    <div>
      <CommonListing
        dateRange={dateRange}
        setDateRange={setDateRange}
        tile={"Live User Trackingsss"}
        bookings={data}
        ShowReportCard={false}
        searchPlaceholder={"Search..."}
        loading={loading}
        columns={columns}
      />
    </div>
  );
};

export default LiveUserListing;
