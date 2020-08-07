import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationGuard, MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChatService } from "../../src/app/service/chart.services";
import { DevicelogService } from "../../src/app/service/azure.devicelog";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    LoginpageComponent,
    DashboardComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    HttpClientModule,
    MsAdalAngular6Module.forRoot({  
      tenant: '341c02c3-f673-4429-b2db-5fa4a986e567',  
      clientId: '5fac77c8-d6ee-4893-a555-7617aa9d3bd8',  
      redirectUri: 'https://smartdashboard.azureedge.net/#/dashboard',  
      endpoints: {  
        'api': '5fac77c8-d6ee-4893-a555-7617aa9d3bd8', // this is for feteching the access token  
      },  
      navigateToLoginRequestUrl: false,  
      cacheLocation: 'localStorage',
       postLogoutRedirectUri: 'https://smartdashboard.azureedge.net/#/login', 
    }), 
  ],
  providers: [ChatService,DevicelogService,AuthenticationGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
