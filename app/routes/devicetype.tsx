/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Paper } from "@mui/material";
import DeviceTypeGrid from "../components/devicetype-table";
import { usePageEffect } from "../core/page";

export const Component = function AreaCode(): JSX.Element {
  usePageEffect({ title: "Device Type" });
  console.log("DeviceType");

  return (
    <Paper style={{width:550, margin: 30}} elevation={3}>
      <DeviceTypeGrid />
    </Paper>
  )
};
