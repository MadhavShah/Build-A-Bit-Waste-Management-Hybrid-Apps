import { Component, ViewChild,ElementRef } from '@angular/core';

import { NavController, ModalController, Platform,AlertController, LoadingController  } from 'ionic-angular';
import { Auth, Logger, API, graphqlOperation} from 'aws-amplify';
import { Geolocation } from "@ionic-native/geolocation";
import { TasksCreatePage } from '../tasks-create/tasks-create';


const logger = new Logger('Home');
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  userlat: number;
  userlong: number;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private plt: Platform,
              public geolocation: Geolocation,
              public alertCtrl:AlertController,
              public loadingCtrl: LoadingController
            ) {
      
  }
  ionViewDidLoad(){
    this.plt.ready().then(() => {
      this.loadMap();
      
    });
  }
// To Load Map and set position to current position
  loadMap(){
    
    var marker2;
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      let mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "landscape.man_made",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ],
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
      console.log("Map Ready");
    }, (err) => {
      console.log("MAP ERROR: "+err);
    });
    var image = {
      url: "https://lh4.googleusercontent.com/proxy/KS777vbYNFIAZ4_uMI5Nt4q01wAI6wvsAtsO8OxrFPWVRNer8M9HBkb1Mk33_g182OcYoPn1JnXJia1nkXboNldfC5RH3Qfz5vfpi3lrAgjWTxQexJkc47x1n5BmCwlj3RwVHMzhgWIXTKH4SKrDPZsY2q9U5SeGGnwpysoM0t3JMF2B-wilfBEZHsWTqSv6UInZ6h85HUhKDmnAFG5KzVL8M9VZqaiXgXe3LvwdMCoFwmrZl-gIgRtJ41lg1w=w5000-h5000",
      scaledSize: new google.maps.Size(20, 20),
    };
    var cityCircle;
    this.geolocation.watchPosition().subscribe(data => {
      setTimeout(() => {
        if(marker2)
          {marker2.setMap(null); }
          this.map.setOptions({ 'controls': { 'compass': true, 'myLocationButton': true,  'indoorPicker': true, 'zoom': true }, 'gestures': { 'scroll': true, 'tilt': true, 'rotate': true, 'zoom': true }, 'camera': { 'target': { 'lat': 22.585331, 'lng': 88.490260 }, 'zoom': 14, } }); 
        marker2 = new google.maps.Marker({
          //animation: google.maps.Animation.BOUNCE,
        position: new google.maps.LatLng(data.coords.latitude, data.coords.longitude),
        icon: image,
        clickable: false
      })
        marker2.setMap(this.map);
        if(cityCircle)
        {        cityCircle.setMap(null);
        }
        cityCircle = new google.maps.Circle({
          strokeColor: '#c0edfd',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#c0edfd',
          fillOpacity: 0.35,
         // editable : true,
         clickable : false,
          map: this.map,
          center: {lat: data.coords.latitude, lng: data.coords.longitude},
          radius: 5
        });
        this.userlat=data.coords.latitude;
        this.userlong=data.coords.longitude;
      }, 0);
    });
  }


  update()
  {
    this.map.setOptions({ 'controls': { 'compass': true, 'myLocationButton': true,  'indoorPicker': true, 'zoom': true }, 'gestures': { 'scroll': true, 'tilt': true, 'rotate': true, 'zoom': true }, 'camera': { 'target': { 'lat': 22.585331, 'lng': 88.490260 }, 'zoom': 14, } }); 
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(latLng);
      var image = {
          url: "https://lh4.googleusercontent.com/proxy/KS777vbYNFIAZ4_uMI5Nt4q01wAI6wvsAtsO8OxrFPWVRNer8M9HBkb1Mk33_g182OcYoPn1JnXJia1nkXboNldfC5RH3Qfz5vfpi3lrAgjWTxQexJkc47x1n5BmCwlj3RwVHMzhgWIXTKH4SKrDPZsY2q9U5SeGGnwpysoM0t3JMF2B-wilfBEZHsWTqSv6UInZ6h85HUhKDmnAFG5KzVL8M9VZqaiXgXe3LvwdMCoFwmrZl-gIgRtJ41lg1w=w5000-h5000",
          scaledSize: new google.maps.Size(20, 20),
        };
      var marker = new google.maps.Marker({
        //animation: google.maps.Animation.BOUNCE,
       position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        icon: image,
        map: this.map});

    }, (err) => {
      console.log(err);
    });
    
  }

  addTask() {
    let addModal = this.modalCtrl.create(TasksCreatePage);
    addModal.onDidDismiss(item => {
      if (!item) { return; }
      //this.GarbageStatus(item);
      
    })
    addModal.present();
  }

 

  async GarbageStatus(item)
{
  var putdata=`mutation a( ){
    CreateGarbageDataInput(input : {
      request_id: `+0+`
	    Time: `+0+`
	    Date: `+0+`
	    Type: `+0+`
	    Image: `+0+`
	    Lat: `+0+`
	    Long: `+0+`
    }){
      request_id
    }
  }`;
  console.log(JSON.stringify(await API.graphql(graphqlOperation(putdata))));
}



setMapOnAll(map) {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
}

clearMarkers() {
  this.setMapOnAll(null);
}

deleteMarkers() {
  this.clearMarkers();
  this.markers = [];
}
 }