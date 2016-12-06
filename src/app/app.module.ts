import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import {
  ResolutionsPage, 
  MilestonesPage
} from '../pages';

import {
  TaskFactory, 
  TaskStore,
  SettingsService, 
  QuoteService
} from '../providers';

import { TaskModal } from '../components';

@NgModule({
  declarations: [
    MyApp,
    ResolutionsPage,
    MilestonesPage,
    TaskModal
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    ResolutionsPage,
    MilestonesPage,
    TaskModal
  ],
  providers: [
    Storage,
    TaskFactory,
    TaskStore,
    SettingsService,
    QuoteService,

    {
      provide: ErrorHandler, 
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}
