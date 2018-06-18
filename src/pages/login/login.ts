import { Component } from '@angular/core';
//var User_table=require('../../../awsmobilejs/backend/cloud-api/UserTable/app');
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { SignupPage } from '../signup/signup';
import { ConfirmSignInPage } from '../confirmSignIn/confirmSignIn';
import { TasksPage } from '../tasks/tasks';

const logger = new Logger('Login');
//User_table.delete();

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
  }/*
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'OTP Verification',
      message: "Enter OTP sent to your mobile no. to verify your account",
      inputs: [
        { 
          name: 'code',
          placeholder: 'Enter OTP',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Resend OTP',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Done',
          handler: data => {
            this.confirm();
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  confirm() {
    Auth.confirmSignIn(this.loginDetails.username, this.code,null)
      .then(() => this.navCtrl.push(TasksPage))
      .catch(err => logger.debug('confirm error', err));
  }*/
}
