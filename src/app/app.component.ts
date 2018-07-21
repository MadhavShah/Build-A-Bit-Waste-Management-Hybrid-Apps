import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Auth } from 'aws-amplify';

import { LoginPage } from '../pages/login/login';
import { TasksPage } from '../pages/tasks/tasks';
import { AccountPage } from '../pages/account/account';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;
  pages: { title: string; component: any; }[];
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    let globalActions = function() {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    };
    this.pages = [
      { title: 'Home', component: TasksPage },
      { title: 'Accounts', component: AccountPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'About', component: AboutPage }
    ];
    
    platform.ready()
      .then(() => {
        Auth.currentAuthenticatedUser()
          .then(() => { this.rootPage = TasksPage; })
          .catch(() => { this.rootPage = LoginPage; })
          .then(() => globalActions());
      });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
