import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Facebook,
  LucideAngularModule,
  Phone,
  Twitter,
  UserRound,
  FileSignature,
  Trash,
  ArrowUp,
  ListFilter,
  ShieldCheck ,
} from 'lucide-angular';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LucideAngularModule.pick({
      Facebook,
      Twitter,
      Phone,
      UserRound,
      FileSignature,
      Trash,
      ArrowUp,
      ListFilter,
      ShieldCheck ,
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    BsDatepickerModule.forRoot(),
    // TooltipModule.forRoot()
  ],
  exports: [
    LucideAngularModule,
    ToastrModule,
    BsDatepickerModule,
    // TooltipModule
  ],
})
export class SharedModule {}
