import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-tasks-create',
  templateUrl: 'tasks-create.html'
})
export class TasksCreatePage {

  isReadyToSave: boolean;

  item: any;

  isAndroid: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
              private datePicker: DatePicker,
              private camera: Camera) {
    this.isAndroid = platform.is('android');
    this.item = {
      'taskId': navParams.get('id'),
      'category': 'Todo',
      'time':'Choose Time',
      'Date':'',
      'TypeofWaste':''
        };
        this.datePicker.show({
          date: new Date(),
          mode: 'date',
          androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
          date => {console.log('Got date: ', date);
        this.item.Date=date},
          err => console.log('Error occurred while getting date: ', err)
        );
    this.isReadyToSave = true;
  }

  ionViewDidLoad() {
  }
picture()
{
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64 (DATA_URL):
    let base64Image = 'data:image/jpeg;base64,' + imageData;
   }, (err) => {
    // Handle error
   });
}
  cancel() {
    this.viewCtrl.dismiss();
  }

  done() { 
    this.viewCtrl.dismiss(this.item);
  }
}
