import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Coffee } from '../logic/Coffee';
import { Router } from '@angular/router';
import { GeoLocationService } from '../geo-location.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  coffeeList!: [Coffee];
  constructor(private data: DataService, private router: Router, private geolocation: GeoLocationService){ }

  ngOnInit(){
    this.data.getList((list: [Coffee]) => {
      this.coffeeList = list;
    })
  }

  goToDetails(coffee: Coffee){
    if (coffee._id){
      this.data.getCoffee(coffee._id, () => this.router.navigate(["/coffee", coffee._id]))
    }
  }

  goToMap(coffee: Coffee){
    if (coffee.location){
      const mapLink = this.geolocation.getMapLink(coffee.location);
      location.href = mapLink;
    }
  }

  deleteCoffee(coffee: Coffee){
    this.data.deleteCoffee(coffee, (result: any) => console.log(result));
  }

  shareCoffee(coffee: Coffee){
    const shareText = `I had thid ${coffee.name} at ${coffee.place} and I give it ${coffee.rating} stars`
    if ('share' in navigator){
      navigator.share({
        title: coffee.name,
        text: shareText,
        url: window.location.href
      }).then(() => console.log("shared")).catch(err => console.error(err));
    }else{
      const shareURL = `whatsapp://send?text=${encodeURIComponent(shareText)}`
      location.href = shareURL;
    }
  }

}
