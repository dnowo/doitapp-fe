import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfooterComponent } from './cfooter.component';

describe('CfooterComponent', () => {
  let component: CfooterComponent;
  let fixture: ComponentFixture<CfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
