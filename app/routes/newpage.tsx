/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import DataGridDemo from "../components/table";
import { usePageEffect } from "../core/page";

export const Component = function NewPage(): JSX.Element {
  usePageEffect({ title: "NewPage" });

  return <DataGridDemo />;
};
