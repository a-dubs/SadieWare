/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import AreaCodeGrid from "../components/areacode-table";
import { usePageEffect } from "../core/page";

export const Component = function AreaCode(): JSX.Element {
  usePageEffect({ title: "AreaCode" });
  console.log("AreaCode");
  return <AreaCodeGrid />;
};
