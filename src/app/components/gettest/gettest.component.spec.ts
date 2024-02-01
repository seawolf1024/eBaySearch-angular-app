import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GettestComponent } from './gettest.component';

describe('GettestComponent', () => {
  let component: GettestComponent;
  let fixture: ComponentFixture<GettestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GettestComponent]
    });
    fixture = TestBed.createComponent(GettestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
