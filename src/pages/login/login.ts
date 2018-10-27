import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { SignupPage } from '../signup/signup';
import { ConfirmSignInPage } from '../confirmSignIn/confirmSignIn';
import { TasksPage } from '../tasks/tasks';

const logger = new Logger('Login');

export class LoginDetails {
  username: string;
  password: string;
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  error: any;
  public loginDetails: LoginDetails;
  public code: string;
  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
            public alertCtrl: AlertController) {
    this.loginDetails = new LoginDetails(); 
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.error = null;
    let details = this.loginDetails;
    logger.info('login..');
    Auth.signIn(details.username, details.password)
      .then(user => {
        logger.debug('signed in user', user);
        //console.log(JSON.stringify(user));
        if (user.challengeName === 'SMS_MFA') {
         this.navCtrl.push(ConfirmSignInPage, { 'user': user });
        } else {
          this.navCtrl.setRoot(TasksPage);
        }
      })
      .catch(err => { this.error = err; })
      .then(() => loading.dismiss());
      
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}