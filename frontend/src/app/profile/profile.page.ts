import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { KeypadModule } from '../shared/native/keyboard/keypad.module';
import { Observable, Subject } from 'rxjs';

import { AddressesComponent } from '../components/addresses/addresses-list/addresses.component';
import { CustomerActions } from '../store/customer/customer.actions';
import { IProfileFacade, ProfileFacade } from './profile.facade';
import { AddressViewComponent } from '../components/addresses/address-view/address-view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    KeypadModule,
    AddressesComponent,
    AddressViewComponent
  ]
})
export class ProfilePage implements OnInit, OnDestroy {

  pageTitle = 'Profile Page';

  viewState$!: Observable<IProfileFacade>;

  private facade = inject(ProfileFacade);

  private readonly ngUnsubscribe = new Subject();

  private store = inject(Store);

  private router = inject(Router);

  // ionViewWillEnter(){
  //   this.store.dispatch(new CustomerActions.RetrieveAllCustomers());
  //   this.store.dispatch(new CustomerActions.GetCustomerOrders());
  // }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
  }

  navigateToOrderReview(orderId: number): void {
    this.router.navigate(['order-review', orderId]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
