import { Component, ViewChild, OnInit } from '@angular/core';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ChatService } from "../../service/chart.services";
import { DevicelogService } from "../../service/azure.devicelog";
import { ResponseFormat } from "../../model/responseformat";
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { CompileShallowModuleMetadata } from '@angular/compiler';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  connection;
  message;
  eventmessage;
  status;
  public tempthresholstatus :boolean = false;
  public humiditythresholstatus :boolean = false;
  public tempthresholdvalue : number =30;
  public humiditythresholdvalue : number =80;
  public setuphumidity : number;
  public setuptemperature : number;
  public username :String;
  public updated_message : String;
  public humidity_condition : String;
  

  public tempDataValue: ChartDataSets[] = [
    { data: [], label: 'Temperature' ,fill: false },
  ];
  public hueDataValue: ChartDataSets[] = [
    { data: [], label: 'Humidity' ,fill: false  },
  ];
  public tempDataLable: Label[] = [];
  public hueDataLabele: Label[] = [];
  countEventsOptions: ChartOptions = {
    animation: {
      duration: 0
    }
 };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgb(51, 138, 249 )',
     // backgroundColor: 'rgb(211, 251, 251)',
    },
  ];

  public lineChartColors1: Color[] = [
    {
      borderColor: 'rgb(28, 74, 217  )',
      backgroundColor: 'rgb(175, 204, 241 )',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  
  today: number = Date.now();


  constructor(private chatService: ChatService,private adalService: MsAdalAngular6Service,private deviceService:DevicelogService) {
    setInterval(() => {this.today = Date.now()
    
      
    }, 1); 
    setInterval(() => {
        
      this.status=false;
      this.message="Offline";
    
      
    }, 40000); 
   }

  ngOnInit(): void {

    this.status=false;
    this.message="Offline";

    this.connection = this.chatService.getLiveData1().subscribe(message => {
     // console.log(message["y"]);
     if(message["y"]!="" ){
   
       const convertobject=JSON.parse(message["y"]);
       const validateobject=JSON.parse(convertobject);
     
      // console.log(myOr1);

     // const myObjStr=JSON.parse(myOr1);
   console.log(validateobject);
    
      console.log(validateobject["t"]+"--"+validateobject["h"]);
      this.drawchart(validateobject["t"],validateobject["h"]);

      this.status=true;
      this.message="Online";

      if(this.tempthresholstatus){

       
        if(validateobject["t"]>this.tempthresholdvalue){

          this.eventmessage= "Tempeature Incresed By : "+( validateobject["t"]-this.tempthresholdvalue);
        }

      }

     if(this.humiditythresholstatus){

      if(validateobject["h"]>this.humiditythresholdvalue){
        if(this.eventmessage != undefined){
          this.eventmessage= this.eventmessage+":"+"Humidity Incresed By : "+( validateobject["h"]-this.humiditythresholdvalue);
        }
        else{
          this.eventmessage= "Humidity Incresed By : "+( validateobject["h"]-this.humiditythresholdvalue);
        }
        
      }

      }
    
         
   
  


     }
    
     if(this.eventmessage != undefined){
      var aaa="{ \"message\":\"Updated at "+this.today+":"+this.eventmessage+"\"}";
      console.log(aaa);
      const testib=JSON.parse(aaa);
        var myJSON = JSON.stringify(testib);
        
        this.chatService.sendMessage(myJSON);
     }
  
     
    });

  

   //   this.chatService.sendMessage(this.eventmessage);

 
  //  console.log(this.getLoggedInUser());
    var detail =JSON.stringify(this.getLoggedInUser());
    const infomation=JSON.parse(detail);
    this.username="\t"+"Logged As "+infomation["profile"]["name"];
  // console.log(infomation["profile"]["name"]);
    
  }

  logout(): void {  
    this.adalService.logout(); 
    
  }  
  
  getLoggedInUser(): any {  
    return this.adalService.userInfo;  
  } 

  drawchart(temperature: number,huemidity: number){

    var d= new Date();

    console.log(""+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());

    if (this.isChartDataFull(this.tempDataValue, 10)) {
      this.removeLastElementFromChartDataAndLabel();
    }

    if (this.isChartDataFull(this.hueDataValue, 10)) {
      this.removeLastElementFromChartDataAndLabel();
    }
    this.tempDataValue[0].data.push(temperature);
    this.hueDataValue[0].data.push(huemidity);
    // var d= new Date();
   this.tempDataLable.push(""+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
  }

  // private getLabel(event: CountEvents): string {
  //   return `${event.window}`;
  // }
  private removeLastElementFromChartDataAndLabel(): void {
    this.tempDataValue[0].data = this.tempDataValue[0].data.slice(1);
    this.hueDataValue[0].data = this.hueDataValue[0].data.slice(1);
    this.tempDataLable = this.tempDataLable.slice(1);
  }

  private isChartDataFull(chartData: ChartDataSets[], limit: number): boolean {
    return chartData[0].data.length >= limit;
  }

temoON()
{
  console.log("on");
  this.tempthresholstatus=true;
}


temoOff()
{
  console.log("off");
  this.tempthresholstatus=false;

}

humiON()
{
  console.log("hon");
  this.humiditythresholstatus=true;

}


humiOff()
{
  console.log("hoff");
  this.humiditythresholstatus=false;
}

humidityset(){

  this.humiditythresholdvalue=parseInt((document.getElementById("humidity") as HTMLInputElement).value);

}
tempset(){

  this.tempthresholdvalue=parseInt((document.getElementById("temperature") as HTMLInputElement).value);

}
humidityStatus(){

  console.log("excuted"+this.hueDataValue[0].data[this.hueDataValue[0].data.length-1]);

  this.deviceService.getHumidityStatus(this.hueDataValue[0].data[this.hueDataValue[0].data.length-1]).subscribe((data : ResponseFormat)=>{
    
    this.humidity_condition=data.status;
    //console.log(data.status.toUpperCase());
    
  }) ;

}

}
