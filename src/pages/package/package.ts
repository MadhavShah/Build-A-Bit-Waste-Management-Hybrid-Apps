import { Component } from '@angular/core';
import { NavController, Tabs, NavParams,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Component({
  selector: 'page-package',
  templateUrl: 'package.html'
})
export class PackagePage {
  packages; selectedPackage;
  constructor(public navCtrl: NavController, public params: NavParams, public loader: LoadingController, public http: Http) {
    this.selectedPackage = params.data.selectedPackage;
    this.packages = [
    ]
    this.sync();
  }
  payment() {
    var t: Tabs = this.navCtrl.parent;
    t.select(1);
  }
  sync() {
    let loading = this.loader.create({
      spinner: 'dots',
      content: 'Loading',
      duration: 5000
    });
    loading.present();

    let url = "https://vp8ekea396.execute-api.us-east-1.amazonaws.com/prod/pricing?type=package";
    this.http.get(url)
      .toPromise()
      .then(response => {
        this.packages= response.json();
        loading.dismiss();
      })
      .catch(error => {
        console.log(error.json())
        loading.dismiss();
      });
  }
  checkEnabled() {
    let enabled = false;
    let cpackage = this.selectedPackage;
    if (cpackage.pack) {
      if (cpackage.pack == 'custom') {
        enabled = cpackage.customPrice != '' && (parseFloat(cpackage.customPrice || 0) > 0);
      } else {
        enabled = true;
      }
    }
    return enabled;
  }
}
