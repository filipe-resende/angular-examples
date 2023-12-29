import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  imports: [
    TranslateModule,
    SharedComponentsModule,
    DirectivesModule,
    PipesModule,
  ],
  exports: [TranslateModule, DirectivesModule, PipesModule],
  declarations: [],
})
export class SharedModule {}
