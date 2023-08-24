/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from '@app/main-layout';


type ControlPanelOptionType = 'FinancialAccounting' |
                              'Land' |
                              'Compliance' |
                              'ChangePassword';



export interface ControlPanelOption {
  title: string;
  description: string;
  actionTitle: string;
  type: ControlPanelOptionType;
  permission: PERMISSIONS;
}


export const ControlPanelOptionList: ControlPanelOption[] = [
  {
    title: 'Financial Accounting',
    description: 'Aplicación para el Sistema de Contabilidad Financiera.' ,
    actionTitle: 'Banobras',
    type: 'FinancialAccounting',
    permission: PERMISSIONS.NOT_REQUIRED,
  },
  {
    title: 'Land',
    description: 'Aplicación para oficinas de catastro.' ,
    actionTitle: 'Zacatecas',
    type: 'Land',
    permission: PERMISSIONS.NOT_REQUIRED,
  },
  {
    title: 'Compliance',
    description: 'Aplicación de Cumplimiento Normativo.' ,
    actionTitle: 'Talanza',
    type: 'Compliance',
    permission: PERMISSIONS.NOT_REQUIRED,
  },
  {
    title: 'Cambiar contraseña',
    description: 'Herramienta para actualizar la contraseña de usuario.',
    actionTitle: 'Cambiar',
    type: 'ChangePassword',
    permission: PERMISSIONS.NOT_REQUIRED,
  },
];
