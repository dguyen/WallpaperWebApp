import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';

@NgModule({
  declarations: [
    CustomSelectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomSelectComponent,
  ]
})
export class SharedModule { }
