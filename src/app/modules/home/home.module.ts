import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchWrapperComponent } from './search-wrapper/search-wrapper.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SearchBlockComponent } from './search-block/search-block.component';

const routes: Routes = [
    {
      path: '',
      component: SearchWrapperComponent,
    },
  ];

@NgModule({
  declarations: [
    SearchWrapperComponent,
    SearchBlockComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
