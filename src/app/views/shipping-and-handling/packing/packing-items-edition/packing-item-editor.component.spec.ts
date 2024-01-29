import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingItemEditorComponent } from './packing-item-editor.component';

describe('PackingItemEditorComponent', () => {
  let component: PackingItemEditorComponent;
  let fixture: ComponentFixture<PackingItemEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingItemEditorComponent]
    });
    fixture = TestBed.createComponent(PackingItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
