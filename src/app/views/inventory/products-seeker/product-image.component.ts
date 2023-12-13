/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'emp-trade-product-image',
  template: `
    <div class="product-image-container mat-elevation-z1"
      [style.height.px]="imageSize"
      [style.width.px]="imageSize">

      <img *ngIf="imageUrl" class="product-image"
        [src]="imageUrl"
        [alt]="code"
        [style.height.px]="imageSize"
        [style.width.px]="imageSize"
        (click)="imageClicked.emit(imageUrl)">

      <div *ngIf="!imageUrl" class="product-not-found">
        Imagen no encontrada
      </div>

    </div>
  `,
  styles: [`
    .product-image-container {

    }

    .product-image {
      object-fit: cover;
      cursor: pointer;
    }

    .product-not-found {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-style: italic;
      color: #9e9e9e;
    }
  `]
})
export class ProductImageComponent {

  @Input() imageUrl = '';

  @Input() imageSize = 144;

  @Input() code = '';

  @Output() imageClicked = new EventEmitter();

}
