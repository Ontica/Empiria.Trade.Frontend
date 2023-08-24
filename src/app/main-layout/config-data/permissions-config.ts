/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PERMISSIONS {

  //
  // DEFAULT
  //

  NOT_REQUIRED = 'permission-not-required',

  //
  // APP PERMISSIONS
  //

  ALL = '*',
}


export const PERMISSION_NOT_REQUIRED = PERMISSIONS.NOT_REQUIRED;


export function getAllPermissions() {
  return Object.keys(PERMISSIONS)
               .map(key => PERMISSIONS[key]);
}
