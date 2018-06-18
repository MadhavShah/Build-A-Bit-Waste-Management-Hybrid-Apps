import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import { NavController, ModalController, AlertController, ToastController, Item,NavParams } from 'ionic-angular';
import { Auth, Logger,API } from 'aws-amplify';
const aws_exports = require('../../aws-exports').default;
import { DynamoDB } from '../../providers/providers';
import { Position } from '@angular/compiler';
import { IconUrl } from 'aws-sdk/clients/mobile';
import { variable } from '@angular/compiler/src/output/output_ast';
import { LoginPage } from '../login/login';
import { start } from 'repl';
import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
//const app= require('../../../awsmobilejs/backend/cloud-api/UserTable/app');

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
  public items: any;
  public sitems: any;
  public jitems: JSON;
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
    public http:Http
  ) {
     // Auth.currentAuthenticatedUser()
    this.username = navParams.get('username');
    Auth.currentUserCredentials()
      .then(credentials => {
        this.userId = credentials.identityId;
        //this.presentToast(this.userId);
      })
      .catch(err => {logger.debug('get current credentials err', err);
    // this.sitems=err;
    this.presentToast(err);
  });
  let url = "https://x2pmcb3wx3.execute-api.us-east-1.amazonaws.com/Development/User_Data/User_Table";
    API.post('User_TableCRUD','/User_Table',{
      "body": 
            {"userId": "React",
             "Name": "1",
              "Email_id": "Learn more Amplify"
            },
          })
      .then(response => {
      //  this.presentToast("res "+JSON.stringify(response));
        this.sitems=JSON.stringify(response);
      })
      .catch(error => {
       // console.log(error);
        this.presentToast("err "+error);
      });
      
  }
  ionViewDidLoad(){
    this.loadMap();
    //this.startNavigating();
  }
  presentToast(data) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 900000,
      position: 'top',
      closeButtonText:'ok'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  
  refreshTasks() {
    const params = {
      'TableName': this.taskTable,
       'KeyConditionExpression': "#userId = :userId",
      'ExpressionAttributeNames': { '#userId': 'Name' },
       'ExpressionAttributeValues': { ':userId': this.username },
       'ScanIndexForward': false
    };
    this.db.getDocumentClient()
      .then(client => (client as DocumentClient).scan(params).promise())
      .then(data => { this.items = data.Items; })
      .catch(err => logger.debug('error in refresh tasks', err))
      .then(() => { this.refresher && this.refresher.complete() });
  }
  getData(i) {
   
    const params = {
      'TableName': this.binTable,
    //   'KeyConditionExpression': "#userId = :userId",
    // 'ExpressionAttributeNames': { '#userId': 'Bin_id' },
    // 'ExpressionAttributeValues': { ':userId': 'AmbujaNeotia' }
        
      };
    
    this.db.getDocumentClient()
      .then(client => (client as DocumentClient).scan(params).promise())
      .then(data => { ;
      })
      .catch(err => this.presentToast(err));
      // this.presentToast(this.items);
      // this.sitems=this.items;
      // this.jitems=this.sitems;
}
  setmarkers()
  {
    this.http.put('https://x2pmcb3wx3.execute-api.us-east-1.amazonaws.com/Development/User_Data/UserTable', {
       id: 12,
      message: 'test'
    }//, { Authorization: 'OAuth2: token' }
);


    var iconBase = 'https://s3.amazonaws.com/techbinapp-hosting-mobilehub-1928256020/icons/';
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
    var areaid;
    const param1 = {
      'TableName': this.taskTable,
      'KeyConditionExpression': "#userId = :userId",
      'ExpressionAttributeNames': { '#userId': 'userId' },
      'ExpressionAttributeValues': { ':userId': this.userId },
      'ScanIndexForward': false
    };
    this.db.getDocumentClient()
      .then(client => (client as DocumentClient).query(param1).promise())
      .then(data => { //this.sitems = JSON.stringify(data.Items);
      areaid=data.Items[0].Area_id })
      .catch(err => {logger.debug('error in refresh tasks', err);
    //this.presentToast(err)
    ;})
      .then(() => { this.refresher && this.refresher.complete() });
      const params = {
        'TableName': this.binTable,   
        };
      var i=0;
      this.latitude=0;
      this.longitude=0;
      this.db.getDocumentClient()
      .then(client => (client as DocumentClient).scan(params).promise())
      .then(data => { //this.sitems= JSON.stringify(data);
          for(let item of data.Items)
          {
            this.latitude+=item.Lattitude;
            this.longitude+=item.Longitude;
            // if(item.Bin_status=='Halt'&& item.Area_code!=areaid)
            //  {continue;}
        var image = {
          url: icons[item.Bin_status].icon,
          scaledSize: new google.maps.Size(50, 50),
        };
      var marker = new google.maps.Marker({
        //animation: google.maps.Animation.BOUNCE,
       position: new google.maps.LatLng(item.Lattitude,item.Longitude),
        icon: image,
        map: this.map});
        var disabled;
        var disabled1;
        if(item.Bin_status=="Halt")
        {
          disabled="disabled";
          disabled1="";
        }
        else{
          disabled1="disabled";
          disabled ="";
        }
        let content = 'Bin Id : '+ item.Bin_id;
        content += '<br>Bin Full percentage : '+ item.Bin_full_percentage;
        content += '<br>Renewable Bin Full percentage : '+ item.Ren_Bin_full_percentage;
        content += '<br>Non Renewable Bin Full percentage : '+ item.Non_Renew_Bin_full_percentage;
        content += '<br>Gas Sensor : '+ item.Gas_Sensor;
        content = content + '<br><button ion-button type="button" id="GoC" block color="primary"'+ disabled+'>Going to Collect</button>' ; 
        content = content + '<br><button ion-button type="button" id="CC" block color="primary"'+disabled1+'>Collected</button>' ; 
        

        this.addInfoWindow(marker, content,item.Bin_id,item.Bin_status);
      }
        this.latitude=this.latitude/data.Count;
        this.longitude=this.longitude/data.Count;
      })
      .catch(err => this.presentToast(err));
      //this.presentToast("User: "+JSON.stringify(this.userId));
        i++;
      
  }
  // putData(Bin_id)
  // {
  //   //this.sitems="Item Added";
  //   const params = {
  //     'TableName': this.binTable,
  //     'Key':{
  //       'Bin_id': Bin_id
  //     },
  //     UpdateExpression: "set collection_status = :n",
  //     ExpressionAttributeValues:{
  //         ":n": 'Halt',
  //     },
  //   };
  //   this.db.getDocumentClient()
  //     .then(client => (client as DocumentClient).update(params).promise())
  //     .then(data => //this.sitems=data
  //     )
  //     .catch(err => this.presentToast(err));
  // }
  // putData2(Bin_id,Bin_status)
  // {
  //   //this.sitems="Item Added";
  //   const params = {
  //     'TableName': this.binTable,
  //     'Key':{
  //       'Bin_id': Bin_id
  //     },
  //     UpdateExpression: "set Bin_status = :n",
  //     ExpressionAttributeValues:{
  //         ":n": 'collected',
  //     },
  //   };
  //   if(Bin_status=="empty")
  //   {
  //   this.db.getDocumentClient()
  //     .then(client => (client as DocumentClient).update(params).promise())
  //     .then(data => //this.sitems=data
  //     )
  //     .catch(err => this.presentToast(err));
  //   }
  // }
  
  loadMap(){
    
 
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(22.585331,  88.490260);
 
      let mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.setmarkers();
 
    }, (err) => {
      console.log(err);
    });
 
  
  }
  // startNavigating(){
 
  //   let directionsService = new google.maps.DirectionsService;
  //   let directionsDisplay = new google.maps.DirectionsRenderer;

  //   directionsDisplay.setMap(this.map);
  //   directionsDisplay.setPanel(this.directionsPanel.nativeElement);

  //   directionsService.route({
  //       origin: {lat: 22.589910, lng:  88.419633},
  //       destination: {lat: 22.585200, lng: 88.490149},
  //       travelMode: google.maps.TravelMode['DRIVING']
  //   }, (res, status) => {

  //       if(status == google.maps.DirectionsStatus.OK){
  //           directionsDisplay.setDirections(res);
  //          // this.presentToast(JSON.stringify(res));
  //       } else {
  //        // this.presentToast(status);
  //           console.warn(status);
  //       }

  //   });
  // }
  addMarker(){
 
    var image = {
      url: 'http://www.pngpix.com/wp-content/uploads/2016/10/PNGPIX-COM-Dustbin-PNG-Image.png', // image is 512 x 512
      scaledSize: new google.maps.Size(40, 40),
    };
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
     // icon: image,
      position: this.map.getCenter(),
     // icon :'http://www.pngpix.com/wp-content/uploads/2016/10/PNGPIX-COM-Dustbin-PNG-Image.png'
    });
   
    let content = "<h4>Information!</h4>";         
   
    //this.addInfoWindow(marker, content);
   
  }
  addInfoWindow(marker, content,Bin_id,Bin_status){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('GoC').addEventListener('click', () => {
        //alert('Clicked');
       // this.presentToast("Hello");
      // this.putData(Bin_id);
      });
      document.getElementById('CC').addEventListener('click', () => {
        //alert('Clicked');
       // this.presentToast("Hello");
      // this.putData2(Bin_id,Bin_status);
      });
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      // setMapOnAll(null);
      infoWindow.close();
      this.setmarkers();
      infoWindow.open(this.map, marker);
    });
    setTimeout(function () { infoWindow.close(); }, 5000);

  }
}
