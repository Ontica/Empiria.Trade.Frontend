/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AppConfig } from '../common-models/common';


export const APP_CONFIG: AppConfig = {
  data: {
    name: 'Sistema Comercial',
    hint: '',
    organization: 'Grupo Sujetsa',
    description: '',
  },
  security: {
    fakeLogin: true,
    enablePermissions: false,
    encriptLocalStorageData: true,
  },
  layout: {
    displayLogo: false,
    displayNavbarHeader: true,
    displayMenuUser: true,
    displayChangeLanguage: true,
    displayChangePassword: true,
    displayAsideLeft: false,
    displaySubMenu: false,
    displayHeader: true,
    displayFooter: true,
  }
};
