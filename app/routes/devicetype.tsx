/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Paper } from "@mui/material";
// import DeviceTypeGrid from "../components/devicetype-table";
import { usePageEffect } from "../core/page";
import { useSelector } from "react-redux";
import { DeviceTypeRow } from "../interfaces";
import { RootState } from "../store";
import { useEffect } from "react";

export const Component = function AreaCode(): JSX.Element {
  usePageEffect({ title: "Device Type" });
  console.log("DeviceType");

  const deviceTypes = useSelector((state: RootState) => state.deviceTypes) as DeviceTypeRow[];

  // log changes in deviceTypes to the console
  useEffect(() => {
    console.log('deviceTypes changed:', deviceTypes);
  }, [deviceTypes]);

  return (
    <Paper style={{ width: 550, margin: 30 }} elevation={3}>
      <h1>Device Type Page</h1>
      {/* <DeviceTypeGrid /> */}
    </Paper>
  )
};
