import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { QuestionsModalComponent } from './modals/questions-modal/questions-modal.component';

@NgModule({
  declarations: [AppComponent, QuestionsModalComponent],
  entryComponents: [QuestionsModalComponent],
  imports: [BrowserModule, HttpClientModule, IonicStorageModule.forRoot(),  IonicModule.forRoot(), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
    StatusBar,
    NativeAudio,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
