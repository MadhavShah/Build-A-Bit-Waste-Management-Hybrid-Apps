import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { API,graphqlOperation, Auth } from "aws-amplify";
import { Clipboard } from "@ionic-native/clipboard";
/**
 * Generated class for the RewardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reward',
  templateUrl: 'reward.html',
})
export class RewardPage {
  username: any;
  public userData: any;
  public rewardId: any;
  rewardItems: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private clipboard: Clipboard,private toastCtrl: ToastController ) {
    this.rewardItems=[];
    Auth.currentUserInfo()
      .then(info => {
        this.username= info.username;
        API.get('User_TableCRUD','/User_Table?user_id='+this.username,{})
      .then(response => {
        console.log("API User "+JSON.stringify(response));
        this.userData=response[0];
        this.rewardId=this.userData.Reward_id.values;
        console.log(this.rewardId);
        for(let id of this.rewardId)
      {
        this.getRewards(id);
      }
      })
      .catch(error => {
        console.log("ERRRRRRRRRRRRROOOOOOOOOOOOOOORRRRRRRR API"+error);
      });
      });
      
  }
  presentToast(data) {
    console.log("toast");
    let toast = this.toastCtrl.create({
      message: data,
      duration: 2000,
      position: 'bottom',
      closeButtonText:'ok'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  async ionViewDidLoad() {
    console.log('ionViewDidLoad RewardPage');
    //this.getRewards("254");
    
  }

  loadCoupons(){
    
  }
  async getRewards(rewardid){
    var getRewards=`query Getreward($Reward_id: String! ) {
      getRewardsTable(reward_id : $Reward_id){
        reward_id
        Stock
	      code
	      cost
	      expiry
	      logo
	      name
	      vendor
      }
    }`;
    const variables={Reward_id: rewardid};
   
    var data= JSON.parse(JSON.stringify(await API.graphql(graphqlOperation(getRewards,variables))));
    //JSON.parse(JSON.stringify(data));
    this.rewardItems.push(data.data.getRewardsTable);
    console.log(JSON.stringify(data));
    console.log(this.rewardItems);
    return await data;
  }
  copyitem(details)
{
  console.log(details.code);
  this.clipboard.copy(details.code);
  this.presentToast("Your code "+details.code+" has been copied.");
  
}



}