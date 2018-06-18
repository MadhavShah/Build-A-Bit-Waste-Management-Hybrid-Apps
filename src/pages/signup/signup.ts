import { Component } from '@angular/core';

import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { LoginPage } from '../login/login';
import { ConfirmSignUpPage } from '../confirmSignUp/confirmSignUp';
import { AuthenticationDetails } from 'amazon-cognito-identity-js';
import { NgModel } from '@angular/forms';

const logger = new Logger('SignUp');

export class UserDetails {
    username: string;
    email: string;
    phone_number: string;
    password: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public userDetails: UserDetails;
  public code: string;
  error: any;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
   this.userDetails = new UserDetails();
  }

  signup() {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.userDetails;
    this.error = null;
    logger.debug('register');
    Auth.signUp(details.username, details.password, details.email, details.phone_number)
      .then(user => {
        this.navCtrl.push(ConfirmSignUpPage, { username: details.username });
        //this.showPrompt();
      })
      .catch(err => { this.error = err; })
      .then(() => loading.dismiss());
  }

  login() {
    this.navCtrl.push(LoginPage);
  }/*
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'OTP Verification',
      message: "Enter OTP sent to your mobile no. to verify your account",
      inputs: [
        { 
          name: 'code',
          placeholder: 'Enter OTP',
        },
      ],
      buttons: [
        {
          text: 'Resend OTP',
          handler: data => {
            this.resendCode();
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Done',
          handler: data => {
            this.confirmSignUp(data);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  resendCode() {
    Auth.resendSignUp(this.userDetails.username)
      .then(() => logger.debug('sent'))
      .catch(err => logger.debug('send code error', err));
      this.showPrompt();
  }
  confirmSignUp(data) {
    Auth.confirmSignUp(this.userDetails.username, data)
      .then(() => this.navCtrl.push(LoginPage))
      .catch(err => logger.debug('confirm error', err));
     
  }
*/
}
