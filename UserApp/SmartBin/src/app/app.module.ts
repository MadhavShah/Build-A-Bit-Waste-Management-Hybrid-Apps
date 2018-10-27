import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
import { Camera } from '@ionic-native/camera';
import { Clipboard } from "@ionic-native/clipboard";

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConfirmSignInPage } from '../pages/confirmSignIn/confirmSignIn';
import { ConfirmSignUpPage } from '../pages/confirmSignUp/confirmSignUp';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamoDB } from '../providers/aws.dynamodb';

import Amplify from 'aws-amplify';
import { RewardPage } from '../pages/reward/reward';
import { TasksCreatePage } from '../pages/tasks-create/tasks-create';
import { DatePicker } from '@ionic-native/date-picker';
const aws_exports = require('../aws-exports').default;

Amplify.configure(aws_exports);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    HomePage,
    RewardPage,
    TasksCreatePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    HomePage,
    RewardPage,
    TasksCreatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    DynamoDB,
    Clipboard,
    DatePicker
  ]
})
export class AppModule {}

declare var AWS;
AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';
