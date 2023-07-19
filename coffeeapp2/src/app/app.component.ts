import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private snackBar: MatSnackBar,
    private swUpdate: SwUpdate){ 
  }

  updateNetworkStatusUI(){
    if (navigator.onLine){
      (document.querySelector('body') as any).style = ""
    }else{
      (document.querySelector('body') as any).style = "filter: grayscale(1)"
    }
  }
  subscribeToPush(){
    Notification.requestPermission(result => {
      if (result === "granted"){
        console.log("Permission granted!")
        // this.ngsw.registerForPush({applicationServerKey: ''})
        //   .susbcribe((registration: NgPushRegistration) => registration)
      }
    })
  }
  ngOnInit(){
    this.swUpdate.versionUpdates.subscribe(update => {
      switch (update.type){
        case 'VERSION_DETECTED':  
          const sb = this.snackBar.open("Do you want to install this app?", "Install now", {duration: 4000});       
          sb.onAction().subscribe(e =>  this.swUpdate.activateUpdate());
          console.log(`Downloading new app version: ${update.version.hash}`);
          location.reload();
      
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${update.currentVersion.hash}`);
          console.log(`New app version ready for use: ${update.latestVersion.hash}`);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${update.version.hash}': ${update.error}`);
          break;
      }
    });
    this.swUpdate.checkForUpdate();
    window.addEventListener("online", this.updateNetworkStatusUI);
    window.addEventListener("offline", this.updateNetworkStatusUI);
    if ((navigator as any).standalone === false){
    this.snackBar.open("You can add this PWA to a home screen", "", {duration: 3000});
    }else if((navigator as any).standalone === undefined){
      if (window.matchMedia("(display-mode: browser)").matches){
      window.addEventListener("beforeinstallprompt", event => {
        event.preventDefault();
        const sb = this.snackBar.open("Do you want to install this app?", "Install", {duration: 5000});
        sb.onAction().subscribe(() => {
          (event as any).prompt();
          (event as any).userChoice().then((result: { outcome: string; }) => {
            if (result.outcome === "dismisses"){

            }else{

            }
          })
        })
        return false;
      })
    }
  }
  }
}
