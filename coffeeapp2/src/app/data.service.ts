import { Injectable } from '@angular/core';
import { Coffee } from './logic/Coffee';
import { PlaceLocation } from './logic/PlaceLocation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  public endpoint = 'http://localhost:3000';

  getList(callback: Function){
    this.http.get(`${this.endpoint}/coffees`)
     .subscribe((response: any) => {
      console.log(response)
      callback(response)
  })
    // const list = [
    //   new Coffee('Double Espresso', 'Niewylej', new PlaceLocation("ul. Żwirki i Wigury 4", "Lublin")),
    //   new Coffee('Caramel Latte', 'Heca', new PlaceLocation("ul. Hipoteczna 5", "Lublin"))
    // ]
    // callback(list);
  }

  deleteCoffee(coffee: Coffee, callback: Function){
    this.http.delete(`${this.endpoint}/coffees/${coffee._id}`)
      .subscribe((response: any) => {
        console.log(response)
        callback(response)
    })
  }

  getCoffee(_id: string, callback: Function){
    this.http.get<Coffee>(`${this.endpoint}/coffees/${_id}`)
      .subscribe((response: any) => {
      console.log(response)
      callback(response)
    })
}

  save(coffee: any, callback: Function){
    if (coffee._id){
      // it's an update
      this.http.put(`${this.endpoint}/coffees/${coffee._id}`, coffee)
       .subscribe((response: any) => callback(true))
    }else{
      // it's an insert
      this.http.post(`${this.endpoint}/coffees`, coffee)
       .subscribe((response: any) => callback(true))
    }
  }
}
