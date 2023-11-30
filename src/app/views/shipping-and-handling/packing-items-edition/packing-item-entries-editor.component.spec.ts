import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingItemEntriesEditorComponent } from './packing-item-entries-editor.component';

describe('PackingItemEntriesEditorComponent', () => {
  let component: PackingItemEntriesEditorComponent;
  let fixture: ComponentFixture<PackingItemEntriesEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackingItemEntriesEditorComponent]
    });
    fixture = TestBed.createComponent(PackingItemEntriesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
