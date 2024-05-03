/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface WarehouseBinForInventory {
  uid: string;
  name: string;
  warehouseName: string;
  positions: number[];
  levels: number[];
}
