import { ComponentFixture, TestBed } from '@angular/core/testing';  
import { ListComponent } from './list.component';  
import { DataService } from '../data.service';  
import { Router } from '@angular/router';  
import { GeoLocationService } from './geo-location.service';  
import { AuthService } from '../auth.service';  
import { of } from 'rxjs';  
  
describe('ListComponent', () => {  
  let component: ListComponent;  
  let fixture: ComponentFixture<ListComponent>;  
  let dataServiceSpy: jasmine.SpyObj<DataService>;  
  let routerSpy: jasmine.SpyObj<Router>;  
  let geoLocationServiceSpy: jasmine.SpyObj<GeoLocationService>;  
  let authServiceSpy: jasmine.SpyObj<AuthService>;  
  
  beforeEach(() => {  
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getList']);  
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);  
    geoLocationServiceSpy = jasmine.createSpyObj('GeoLocationService', ['getCurrentPosition']);  
    authServiceSpy = jasmine.createSpyObj('AuthService', ['userObject$']);  
  
    TestBed.configureTestingModule({  
      declarations: [ ListComponent ],  
      providers: [  
        { provide: DataService, useValue: dataServiceSpy },  
        { provide: Router, useValue: routerSpy },  
        { provide: GeoLocationService, useValue: geoLocationServiceSpy },  
        { provide: AuthService, useValue: authServiceSpy }  
      ]  
    });  
  
    fixture = TestBed.createComponent(ListComponent);  
    component = fixture.componentInstance;  
  });  
  
  it('should create', () => {  
    expect(component).toBeTruthy();  
  });  
  
  it('should set currentUser and coffeeList on init if user is authenticated', () => {  
    const user = { _id: '1L3RigSqkVeH3c08' };  
    authServiceSpy.userObject$.and.returnValue(of(user));  
    const response = { message: [{ name: 'Cold Brew',place:"Niewylej",location:null,type:"Espresso","_id":"OGNDWcpDKotf2JKz"}] };  
    dataServiceSpy.getList.and.callFake((userId, callback) => {  
      callback(response);  
    });  
  
    component.ngOnInit();  
  
    expect(authServiceSpy.userObject$).toHaveBeenCalled();  
    expect(component.currentUser).toEqual(user);  
    expect(dataServiceSpy.getList).toHaveBeenCalledWith(user._id, jasmine.any(Function));  
    expect(component.coffeeList).toEqual(response.message);  
  });  
  
  it('should listen to window online event and call handleOnlineIndexDB', () => {  
    spyOn(window, 'addEventListener');  
    spyOn(component, 'handleOnlineIndexDB');  
  
    component.ngOnInit();  
  
    expect(window.addEventListener).toHaveBeenCalledWith('online', component.handleOnlineIndexDB);  
    expect(component.handleOnlineIndexDB).toHaveBeenCalled();  
  });  
}); 
