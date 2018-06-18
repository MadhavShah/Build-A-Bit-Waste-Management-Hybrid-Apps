import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation} from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConfirmSignInPage } from '../pages/confirmSignIn/confirmSignIn';
import { ConfirmSignUpPage } from '../pages/confirmSignUp/confirmSignUp';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { TasksPage } from '../pages/tasks/tasks';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamoDB } from '../providers/aws.dynamodb';

import Amplify from 'aws-amplify';
import { Camera } from '@ionic-native/camera';
import { GoogleMapsClusterProvider } from '../providers/google-maps-cluster/google-maps-cluster';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map'
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
    TasksPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    TasksPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    DynamoDB,
    GoogleMapsClusterProvider
  ]
})
export class AppModule {}

declare var AWS;
AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';
