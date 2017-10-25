import { IonMaskService } from './ion-mask.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonInputMaskComponent } from './ion-mask/ion-mask.component';

import { config, initialConfig, optionsConfig } from './config';

export * from './ion-mask/ion-mask.component';
// export * from './ion-mask.service';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  declarations: [
    IonInputMaskComponent
  ],
  exports: [
    IonInputMaskComponent
  ],
  providers: [IonMaskService]
})
export class IonMaskModule {
  public static forRoot(configValue: optionsConfig = initialConfig): ModuleWithProviders {
    return {
      ngModule: IonMaskModule,
      providers: [
        {
          provide: config,
          useValue: { ...initialConfig, ...configValue }
        }
      ]
    };
  }
}
