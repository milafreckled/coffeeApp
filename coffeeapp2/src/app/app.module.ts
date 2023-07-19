import { Component, NgModule, isDevMode } from '@angular/core';
import { environment } from '../environment';
import { BrowserModule } from '@angular/platform-browser';
import { GeoLocationService } from './geo-location.service';
import {DataService} from './data.service'
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import 'hammerjs'
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule }from '@angular/material/slider';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ListComponent } from './list/list.component';
import { CoffeeComponent } from './coffee/coffee.component'
import { Routes, RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

const routes: Routes = [
  { path: "", component: ListComponent},
  { path: "coffee", component: CoffeeComponent},
  {path: "coffee/:id", component: CoffeeComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CoffeeComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    ServiceWorkerModule,
    MatButtonModule, MatInputModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule,
    MatSlideToggleModule, MatCardModule, MatSnackBarModule, 
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}),
  ],
  providers: [
    GeoLocationService, DataService,
    BrowserAnimationsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
