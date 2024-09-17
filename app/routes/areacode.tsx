/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Paper } from "@mui/material";
// import AreaCodeGrid from "../components/areacode-table";
import { usePageEffect } from "../core/page";

export const Component = function AreaCode(): JSX.Element {
  usePageEffect({ title: "Area Code" });
  console.log("AreaCode");

  return (
    <Paper style={{width:500, margin: 30}} elevation={3}>
      {/* <AreaCodeGrid /> */}
    </Paper>
  )
};
