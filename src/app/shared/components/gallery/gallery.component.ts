/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';


export interface GalleryConfig {
  backdropClick?: boolean;
}


const DefaultGalleryConfig: GalleryConfig = {
  backdropClick: true,
};

@Component({
  selector: 'emp-ng-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent {
  @Input() image: string = null;

  @Input()
  get config() {
    return this.galleryConfig;
  }
  set config(value: GalleryConfig) {
    this.galleryConfig = Object.assign({}, DefaultGalleryConfig, value);
  }

  @Output() backdropClick = new EventEmitter();

  galleryConfig: GalleryConfig = DefaultGalleryConfig;


  onBackdropClick() {
    if (this.config.backdropClick) {
      this.backdropClick.emit();
    }
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
