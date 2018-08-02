import { Component, ViewChild,ElementRef } from '@angular/core';

import { NavController, ModalController, Platform,AlertController, LoadingController  } from 'ionic-angular';
import { Auth, Logger, API, graphqlOperation} from 'aws-amplify';
import { Geolocation } from "@ionic-native/geolocation";


const logger = new Logger('Home');
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public items: any;
  public refresher: any;
  public binData: any;
  public username: string;
  public userlat: any;
  public userlong: any;
  public volume1: any;
  public volume2: any;
  public POINTS:any;
  rewardData: any;
  markers = [];
  rewardId: any;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private plt: Platform,
              public geolocation: Geolocation,
              public alertCtrl:AlertController,
              public loadingCtrl: LoadingController
            ) {

      Auth.currentUserInfo()
      .then(info => {
        this.username= info.username;
        API.get('User_TableCRUD','/User_Table?user_id='+this.username,{})
      .then(response => {
        console.log("API User "+JSON.stringify(response));
        this.rewardId=response[0].Reward_id.values;
        console.log(this.rewardId);
      })
      .catch(error => {
        console.log("ERRRRRRRRRRRRROOOOOOOOOOOOOOORRRRRRRRAPI"+error);
      }).then(()=>{
        this.refresher && this.refresher.complete()
      });
      });
    //   let myInit = {
    //     body: {

    //     }, // replace this with attributes you need
    // }
    //   API.put('User_TableCRUD','/User_Table',myInit).then(response => {
    //     // Add your code here
    // }).catch(error => {
    //     console.log(error.response)
    // });
      
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
        this.setmarkers();
    
      
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


  async setmarkers()
  {
    var bin=JSON.parse(JSON.stringify(await this.getbinData()));
    console.log(JSON.stringify(bin.data.listBinData.items));
    var iconBase = 'https://s3.amazonaws.com/techbinapp-hosting-mobilehub-1928256020/icons/new/';
    var icons = {
      empty: {
        icon: iconBase + 'bin1.png'
      },
      active: {
        icon: iconBase + 'bin3.png'
      },
      full: {
        icon: iconBase + 'bin6.png'
      },
      Halt: {
        icon: iconBase + 'redbinicon.png'
      }
    };
     for(let item of bin.data.listBinData.items)
      {
        //console.log(JSON.stringify(item));
          if(item.collection_status=='GoingToCollect')
           {continue;}
        // 
        // console.log(item.Bin_status);
        var image = {
        url: icons[item.Bin_status].icon,
        scaledSize: new google.maps.Size(70, 50),
        };
      var marker = new google.maps.Marker({
    //animation: google.maps.Animation.BOUNCE,
        position: new google.maps.LatLng(item.Lattitude,item.Longitude),
        icon: image,
        map: this.map});
      google.maps.event.addListener(marker, 'click', () => {
        var p1={
          lat : this.userlat,
          lng : this.userlong
        };
        var p2={
          lat : item.Lattitude,
          lng : item.Longitude
        }
       var dis=getDistance(p1,p2);
          if(dis<10)
          {
        console.log("alert");
          let alert= this.alertCtrl.create({
            title: 'Welcome',
            subTitle: 'Click below when you are ready to dump!',
            buttons:[
              {
                text: 'Ready',
                handler:  () => {
                  console.log('ready clicked');
                  var bin_Data;
                  //Getting the bin Data
                  this.getspecificData(item.Bin_id).then((res)=>{
                    console.log("points  "+JSON.stringify(res));
                    bin_Data=JSON.parse(JSON.stringify(res));
                    if(bin_Data.data.getBinData.Status==="Available")
                  {
                    this.binStatus(bin_Data.data.getBinData.Bin_id,"Dumping in Progress");
                    console.log("Hello");
                    this.volume1=bin_Data.data.getBinData.Bin_full_percentage;
                      let loading = this.loadingCtrl.create({
                        //spinner: 'hide',
                        content: "Waiting for you to dump.<br>Tap anywhere or wait for 5 seconds",//JSON.stringify(i)
                        enableBackdropDismiss: false,
                        //showBackdrop:false
                      });
                      let subscription;
                      loading.present();
                      setTimeout(() => {
                        loading.dismiss();
                      }, 5000);
                      loading.willEnter.subscribe(() => {
                        subscription = this.plt.registerBackButtonAction(() => {
                          console.log('back button pressed');
                          loading.dismiss();
                        }, 10);
                      });
                      loading.onDidDismiss(async ()=>{
                        subscription();
                        console.log("Dissmissed");
                        this.binStatus(bin_Data.data.getBinData.Bin_id,"Available");
                        var dismissData= JSON.parse(JSON.stringify(await this.getspecificData(item.Bin_id)));
                        console.log("Dismiss"+JSON.stringify(dismissData));
                        this.volume2=dismissData.data.getBinData.Bin_full_percentage;
                      }
                    );
                    if(this.volume2-this.volume1 >1 )
                    {
                        
                    }
                  }
                  else
                  {
                    let alert = this.alertCtrl.create({
                      title: 'Try later',
                      subTitle: 'Bin is Already in use. Please wait.....',
                      buttons: ['Ok']
                    });
                    alert.present();
                  }
                  });
                }
              },
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
        alert.present();
      }
     });

  };
    
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

  

 async getbinData()
 {
  const ListEvents = `query ListEvents {
    listBinData{
      items{
        Bin_id
        Area_id
        Bin_full_percentage
        Bin_status
        Lattitude
        Longitude
        Non_Renew_Bin_full_percentage
        Ren_Bin_full_percentage
        mail_sent
        time_stamp
        Status
        collection_status
      }
    }
  }`;

  var allevents= await API.graphql(graphqlOperation(ListEvents));
  //console.log(JSON.stringify(allevents));
  return await allevents;
 }
  async getspecificData(binid)
{
  var GetEvent = `query GetEvent($Bin_id: String! ) {
    getBinData(Bin_id: $Bin_id){
        Bin_id
        Area_id
        Bin_full_percentage
        Bin_status
        Lattitude
        Longitude
        Non_Renew_Bin_full_percentage
        Ren_Bin_full_percentage
        mail_sent
        time_stamp
        Status
        collection_status
    }
  }`;
 const variables={Bin_id: binid};
 var data= await API.graphql(graphqlOperation(GetEvent,variables));
 //console.log(JSON.stringify(data));
 return await data;
}

  async binStatus(binid,status)
{
  var putdata=`mutation a($Bin_id: String!,$Status: String! ){
    updateBinData(input : {
      Bin_id: $Bin_id
      Status: $Status
    }){
      Status
    }
  }`;
  const variables={Bin_id: binid,Status:status};
  console.log(JSON.stringify(await API.graphql(graphqlOperation(putdata,variables))));
}

async points(binid,status)
{
  var putdata=`mutation a($Bin_id: String!,$Status: String! ){
    updateBinData(input : {
      Bin_id: $Bin_id
      Status: $Status
    }){
      Status
    }
  }`;
  const variables={Bin_id: binid,Status:status};
  console.log(JSON.stringify(await API.graphql(graphqlOperation(putdata,variables))));
}


addMarker(location, image) {
  let marker = new google.maps.Marker({
    position: location,
    map: this.map,
    icon: image
  });
  this.markers.push(marker);
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

 var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};