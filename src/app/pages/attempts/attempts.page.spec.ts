import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttemptsPage } from './attempts.page';

describe('AttemptsPage', () => {
  let component: AttemptsPage;
  let fixture: ComponentFixture<AttemptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttemptsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttemptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
