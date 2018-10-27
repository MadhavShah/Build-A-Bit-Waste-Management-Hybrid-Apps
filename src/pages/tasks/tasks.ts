import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import { NavController, ModalController, AlertController, ToastController, Item,NavParams, LoadingController } from 'ionic-angular';
import { Auth, Logger,API,graphqlOperation } from 'aws-amplify';
const aws_exports = require('../../aws-exports');
import { DynamoDB } from '../../providers/providers';
import { Http } from '@angular/http';
import { setTimeout } from 'timers';

declare var google: any;
const logger = new Logger('Tasks');

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html'
})
export class TasksPage {
  longitude: number;
  latitude: number;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;
  position: Geoposition;
  markers: any[];
  public items: any;
  public sitems: any;
  public binData: any;
  public binFull: number;
  public username: string;
  public refresher: any;
  private taskTable: string = aws_exports.aws_resource_name_prefix + '-User_Table';
  private userId: string;
  private binTable: string= 'Bin_Data';

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public db: DynamoDB,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    public http:Http,
    private loadingCtrl: LoadingController
  ) {
      this.username = navParams.get('username');
      this.markers=[];
      this.latitude=0;
      this.longitude=0;
  }

  
  async ionViewDidLoad(){
    // this.binData=await this.listBinData();
    // this.addmarkers();
    this.loadMap();
    console.log("HERE"+JSON.stringify(this.binData));
    //this.directions();
    this.startNavigating();
    // this.setmarkers();
  }


  async listBinData()
  {
    const ListEvents = `query ListEvents {
      listBinData{
        items{
          Bin_id
          Area_id
          Gas_Sensor
          Bin_full_percentage
          Bin_status
          Lattitude
          Longitude
          Non_Renew_Bin_full_percentage
          Ren_Bin_full_percentage
          mail_sent
          time_stamp
          }
        }
      }`;
  let y=await API.graphql(graphqlOperation(ListEvents));
  console.log(JSON.stringify(y));
  return await JSON.parse(JSON.stringify(y)).data.listBinData.items;
  }

  async getBinData(binid)
  {
    const getEvents = `query GetEvent($Bin_id: String! ) {
      getBinData(Bin_id: $Bin_id){
          Bin_id
          Area_id
          Gas_Sensor
          Bin_full_percentage
          Bin_status
          Lattitude
          Longitude
          Non_Renew_Bin_full_percentage
          Ren_Bin_full_percentage
          mail_sent
          time_stamp
          collection_status
        }
      }`;
      
 const variables={Bin_id: binid};
  let y=await API.graphql(graphqlOperation(getEvents,variables));
  console.log("GET    "+JSON.stringify(y));
  return await JSON.parse(JSON.stringify(y)).data.getBinData;
  }

  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {
      //getting the Latitude and Longitude inside latLng variable
      let latLng = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);
      let mapOptions = {
        center: latLng, // Centering my Map
        zoom: 16,
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
      while(!this.map)
      {console.log("mapnot")};

    }, (err) => {
      console.log(err);
    });

      this.currentposition();
  }


  currentposition()
  {
    var marker2;
    var cityCircle;
    var image = {
      url: "https://lh4.googleusercontent.com/proxy/KS777vbYNFIAZ4_uMI5Nt4q01wAI6wvsAtsO8OxrFPWVRNer8M9HBkb1Mk33_g182OcYoPn1JnXJia1nkXboNldfC5RH3Qfz5vfpi3lrAgjWTxQexJkc47x1n5BmCwlj3RwVHMzhgWIXTKH4SKrDPZsY2q9U5SeGGnwpysoM0t3JMF2B-wilfBEZHsWTqSv6UInZ6h85HUhKDmnAFG5KzVL8M9VZqaiXgXe3LvwdMCoFwmrZl-gIgRtJ41lg1w=w5000-h5000",
      scaledSize: new google.maps.Size(20, 20)
    };
    this.geolocation.watchPosition().subscribe(data => {
      setTimeout(() => {
        if(marker2)
          {marker2.setMap(null);}
        marker2 = new google.maps.Marker({
          position: new google.maps.LatLng(data.coords.latitude, data.coords.longitude),
          icon: image,
          clickable: false
          });
        marker2.setMap(this.map);
        if(this.latitude==0 && this.longitude==0)
        {
          console.log("no position");
          this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));

        }
        if(cityCircle)
        {
          cityCircle.setMap(null);
        }
        cityCircle = new google.maps.Circle({
          strokeColor: '#c0edfd',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#c0edfd',
          fillOpacity: 0.35,
          clickable : false,
          map: this.map,
          center: {lat: data.coords.latitude, lng: data.coords.longitude},
          radius: 5
        });
      }, 0);
    });
  }

  startNavigating(){
 
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    this.markers=[{
      location: 'ranchi',
      stopover: true
    },{
      location: 'Delhi',
      stopover: true
    },
    {
      location: 'Mumbai',
      stopover: true
    }];
    directionsDisplay.setMap(this.map);
    // directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({
        origin: 'kolkata',
        destination: 'kolkata',
      waypoints: this.markers,
      optimizeWaypoints: true,
        travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

        if(status == google.maps.DirectionsStatus.OK){
          var polyline = new google.maps.Polyline({
            path: [],
            strokeColor: '#0000FF',
            strokeWeight: 3
          });
          var bounds = new google.maps.LatLngBounds();
    
    
          var legs = res.routes[0].legs;
          for (let i = 0; i < legs.length; i++) {
            var steps = legs[i].steps;
            for (let j = 0; j < steps.length; j++) {
              var nextSegment = steps[j].path;
              for (let k = 0; k < nextSegment.length; k++) {
                polyline.getPath().push(nextSegment[k]);
                bounds.extend(nextSegment[k]);
              }
            }
          }
    
          polyline.setMap(this.map);
          console.log(JSON.stringify(res));
        } else {
            console.warn(status);
        }

    });

}
  directions()
  {
    let latLng = new google.maps.LatLng(23.815079, 86.442215);
    let latLng2 = new google.maps.LatLng(23.815010, 86.438599);
    let latLng3 = new google.maps.LatLng(23.812615, 86.440444);
    this.markers[0]={
      location: latLng2,
      stopover: true
    };
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService.route({
      origin: latLng,
      destination: latLng2,
      waypoints: this.markers,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }
 addmarkers()
 {
  var iconBase = 'https://s3.amazonaws.com/techbinapp-hosting-mobilehub-1928256020/icons/';
  var icons = {
   1: {
     icon: iconBase + 'bin1.png'
   },
   2: {
     icon: iconBase + 'bin2.png'
   },
   3: {
     icon: iconBase + 'bin2.png'
   },
   4: {
     icon: iconBase + 'bin3.png'
   },
   5: {
    icon: iconBase + 'bin3.png'
  },
  6: {
    icon: iconBase + 'bin4.png'
  },
  7: {
    icon: iconBase + 'bin4.png'
  },
  8: {
    icon: iconBase + 'bin5.png'
  },
  9: {
    icon: iconBase + 'bin5.png'
  },
  10: {
    icon: iconBase + 'bin6.png'
  }
 };
   for(let item of this.binData)
       {
         //console.log("item add  "+JSON.stringify(item));
          
         console.log("markersetting");


         var iconId=Math.ceil(item.Bin_full_percentage/10).toString();
         var image = {
           url: icons[iconId].icon,
           scaledSize: new google.maps.Size(60, 50),
         };

         
         var marker = new google.maps.Marker({
           position: new google.maps.LatLng(item.Lattitude,item.Longitude),
           icon: image,
           });
         var pointer={
           "marker": marker,
           "item": item
         };
         this.markers.push(pointer);
         console.log("markerset");
       }
 }

 setmarkers()
 {
   var i=0;
  API.get('User_TableCRUD','/User_Table',{})
    .then(response => {
      for(let pointer of this.markers)
      {
        if(pointer.item.Area_id!=response[0].Area_id)
              {continue;}
        i++;
        if(this.map){
          pointer.marker.setMap(this.map);
        }
        else{
            setTimeout(()=>{
              pointer.marker.setMap(this.map);
            },2000);
        }
        this.latitude+=pointer.item.Lattitude;
        this.longitude+=pointer.item.Longitude;
       console.log(this.latitude+"  "+this.longitude);
     this.addInfoWindow(pointer.marker,pointer.item);
      }
      this.latitude/=i;
    this.longitude/=i;
    if(this.map){
      this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
      setTimeout(()=>{
        this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
      },2000);
    }
    else{
      setTimeout(()=>{
        this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
      },4000);
    }
    })
    .catch(error => { console.log(error);
    });
    
   
 }
 
  
  addInfoWindow(marker, item){
    var setinterval;
     google.maps.event.addListener(marker, 'click', async () => {
      item= await this.getBinData(item.Bin_id);
      //console.log("aaa"+JSON.stringify(item))
    var disabled,disabled1;
    
    if(item.collection_status=="GoingToCollect")
            {
              disabled="disabled";
              disabled1="";
            }
            else{
              disabled1="disabled";
              disabled ="";
            }
    let content = '<h4>Bin Details</h4>'+'<div id="Bin_id">'+'Bin Id : '+ item.Bin_id+'</div>'
             + '<div id="Bin_full_percentage">'+'Bin Full percentage : '+ item.Bin_full_percentage+'</div>'
            + '<div id="Ren_Bin_full_percentage">'+'Renewable Bin Full percentage : '+ item.Ren_Bin_full_percentage+'</div>'
            + '<div id="Non_Renew_Bin_full_percentage">'+'Non Renewable Bin Full percentage : '+ item.Non_Renew_Bin_full_percentage+'</div>'
            + '<div id="Gas_Sensor">'+'Gas Sensor : '+ item.Gas_Sensor+'</div>'
            + '<button ion-button type="button" id="GoC" block color="primary"'+ disabled+'>Going to Collect</button>'
            + '<button ion-button type="button" id="CC" block color="primary"'+disabled1+'>Collected</button>' ;
    let infoWindow = new google.maps.InfoWindow({
      content: content
      });
      //realtime change of bin Data
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {

      document.getElementById('GoC').addEventListener('click', () => {
        console.log("GoC");
       this.putBinData(item.Bin_id, "GoingToCollect");
      });

      document.getElementById('CC').addEventListener('click', async () => {
       item= await this.getBinData("AmbujaNeotia");
       if(item.Bin_full_percentage < 5)
       {
        console.log("GoC");
        this.putBinData(item.Bin_id, "Collected");
       }
       else{
        let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: "Please First Collect the garbge.<br>Then click this button",
          enableBackdropDismiss: false,
          //showBackdrop:false
        });
        loading.present();
        setTimeout(() => {  loading.dismiss();}, 5000);
       }
      });
      setinterval=setInterval(async ()=>{
      await this.getBinData(item.Bin_id).then((response)=>{
        if(response.collection_status=="GoingToCollect")
            {
              (<HTMLInputElement>document.getElementById('GoC')).disabled=true ;
              (<HTMLInputElement>document.getElementById('CC')).disabled=false ;
              //console.log("lll"+JSON.stringify(c));
              
            }
            else{
              (<HTMLInputElement>document.getElementById('CC')).disabled=true ;
              (<HTMLInputElement>document.getElementById('GoC')).disabled=false ;
            }
        document.getElementById('Bin_id').innerHTML='Bin Id : '+response.Bin_id.toString();
        document.getElementById('Bin_full_percentage').innerHTML='Bin Full percentage : '+response.Bin_full_percentage.toString();
        document.getElementById('Ren_Bin_full_percentage').innerHTML='Renewable Bin Full percentage : '+response.Ren_Bin_full_percentage.toString();
        document.getElementById('Non_Renew_Bin_full_percentage').innerHTML='Non Renewable Bin Full percentage : '+response.Non_Renew_Bin_full_percentage.toString();
        document.getElementById('Gas_Sensor').innerHTML='Gas Sensor : '+response.Gas_Sensor.toString();
        // document.getElementById('GoingToCollect').innerHTML='<button ion-button type="button" id="GoC" block color="primary"'+ disabled+'>Going to Collect</button>';
        // document.getElementById('Collected').innerHTML='<button ion-button type="button" id="CC" block color="primary"'+disabled1+'>Collected</button>';
      });
    },2000);
    google.maps.event.addListenerOnce(infoWindow, 'closeclick', () => {
      console.log("close");
      clearInterval(setinterval);
    });

      
    });
      infoWindow.close();
      infoWindow.open(this.map, marker);

    });
    

  }

  async putBinData(binid,collection_status){
    var putdata=`mutation a($Bin_id: String!,$Status: String! ){
      updateBinData(input : {
        Bin_id: $Bin_id
        collection_status: $Status
      }){
        collection_status
      }
    }`;
    const variables={Bin_id: binid,Status:collection_status};
    console.log(JSON.stringify(await API.graphql(graphqlOperation(putdata,variables))));
  }

  presentToast(data) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 9000,
      position: 'top',
      closeButtonText:'ok'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
