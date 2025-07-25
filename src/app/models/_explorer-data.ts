/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { FileReport } from './reporting';


export interface ExplorerTypeConfig<T> {
  type: T;
  nameSingular: string;
  namePlural: string;
  pronounSingular: string;
  pronounPlural: string;
  selectionMessage: string;
  permissionToCreate: PERMISSIONS;
}


export enum EntityStatus {
  Pending      = 'Pending',
  Active       = 'Active',
  OnReview     = 'OnReview',
  Closed       = 'Closed',
  Suspended    = 'Suspended',
  Discontinued = 'Discontinued',
  Deleted      = 'Deleted',
}


export const EntityStatusList: Identifiable<EntityStatus>[] = [
  { uid: EntityStatus.Pending,      name: 'Pendiente' },
  { uid: EntityStatus.Active,       name: 'Activo' },
  { uid: EntityStatus.OnReview,     name: 'En revisión' },
  { uid: EntityStatus.Closed,       name: 'Cerrado' },
  { uid: EntityStatus.Suspended,    name: 'Suspendido' },
  { uid: EntityStatus.Discontinued, name: 'Descontinuado' },
  { uid: EntityStatus.Deleted,      name: 'Eliminado' },
];


export function isEntityStatusInWarning(statusName: string): boolean {
  const status = EntityStatusList.find(x => x.name === statusName)?.uid as EntityStatus;

  return [EntityStatus.Deleted,
          EntityStatus.Discontinued,
          EntityStatus.Suspended].includes(status);
}


export enum ExplorerOperationType {
  excel        = 'export',
  excelEntries = 'export-entries',
  pdf          = 'print',
  delete       = 'delete',
}

export interface ExplorerOperation extends Identifiable {
  uid: string;
  name: string;
  showConfirm?: boolean;
  isConfirmWarning?: boolean;
  confirmOperationMessage?: string;
  confirmQuestionMessage?: string;
}


export interface ExplorerOperationCommand {
  items: string[];
}


export interface ExplorerOperationResult {
  message: string;
  file: FileReport;
}


export interface ExplorerBulkOperationData {
  operation: ExplorerOperationType,
  command: ExplorerOperationCommand;
  title: string;
  message: string;
  fileUrl: string;
}


export interface BaseActions {
  canUpdate: boolean;
  canDelete: boolean;
  canEditDocuments: boolean;
}


export const EmptyExplorerBulkOperationData: ExplorerBulkOperationData = {
  operation: null,
  command: null,
  title: '',
  message: '',
  fileUrl: '',
};


export const EmptyBaseActions: BaseActions = {
  canUpdate: false,
  canDelete: false,
  canEditDocuments: false,
};
