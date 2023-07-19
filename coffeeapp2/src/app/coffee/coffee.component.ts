import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Coffee } from '../logic/Coffee';
import { Subscription } from 'rxjs';
import { GeoLocationService } from '../geo-location.service';
import { TastingRating } from '../logic/TastingRating';
import { DataService } from '../data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['./coffee.component.css']
})

export class CoffeeComponent implements OnInit{
  constructor(private route: ActivatedRoute, private geolocation: GeoLocationService,
    private router: Router, private data: DataService){}
  coffee!: Coffee;
  coffeeId!: number;
  routingSubscription!: Subscription;
  db: IDBDatabase | undefined;
  types = ["Espresso", "Americano", "Latte", "Cappucino", "Flat white"];
  newCoffeeGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)]),
    place: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)]),
    location: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/)]),
    city: new FormControl('', [Validators.pattern(/^[a-zA-Z_]+( [a-zA-Z_]+)*$/)]),
    coffeeType: new FormControl('', [Validators.required])
  })

  tastingRatingChecked(checked: boolean){
    if (checked){
      this.coffee.tastingRating = new TastingRating();
    }
  }

  cancel(){
    this.router.navigate(["/"]);
  }

  save(){
    this.data.save(this.coffee, (result: any) => {
      if (result){
        this.router.navigate(["/"]);
      }
    })
    if (this.db){
      const tx = this.db.transaction("coffees", "readwrite");
      const store = tx.objectStore("coffeeList");
      const request = store.put(this.coffee);
    }
  }

  public validateControl = (controlName: string, errorName: string) =>{  
    const control = this.newCoffeeGroup.get(controlName);
    return control?.dirty && !control?.touched && control?.hasError(errorName);
  }

  ngOnInit(){
    this.coffee = new Coffee();
    this.routingSubscription = this.route.params.subscribe(params => {
      console.log(params["id"]);
      if (params["id"]){
        this.coffeeId = +params["id"]
        this.data.getCoffee(params["id"], (response: Coffee) => this.coffee = response);
      }
    });
    if ((navigator as any).offline){
      const request = indexedDB.open("coffees", 1);
      request.onerror = (error) => {
        reportError(request.error);
        if (this.db){
          this.db.close();
        }
      }
      request.onsuccess = (event: any) => {
        this.db = request.result;
      }
      request.onupgradeneeded = function(event) {
        const db = request.result;
        if (event.oldVersion < 1){
          const coffeeList = db.createObjectStore("coffeeList", {keyPath: "_id"});
          const placeIndex = coffeeList.createIndex("by_place", "place");
        }
      }
      if (this.db){
        this.db.onversionchange = () => {
        // First, save any unsaved data:
          this.save();
          if (!document.hasFocus()) {
            location.reload();
          } else {
              alert("Please reload this page for the latest version.");
            }
        };
      };
    }

    this.geolocation.requestGeoLocation((location: any) => {
      if (location && this.coffee.location){
        this.coffee.location.latitude = location.latitude;
        this.coffee.location.longitude = location.longitude;
      }
    })
  }

  ngOnDestroy(){
    this.routingSubscription.unsubscribe();
  }
}
