import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { ICartComponentFacadeModel, CartComponentFacade } from '../cart.component.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'woo-cart',
  templateUrl: './woo-cart.component.html',
  styleUrls: ['./woo-cart.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class WooCartComponent implements OnInit, OnDestroy {

  viewState$: Observable<ICartComponentFacadeModel>;

  private facade = inject(CartComponentFacade);

  private router = inject(Router);

  // 

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;

    // this.viewState$
    //   .subscribe({
    //     next: (vs: ICartComponentFacadeModel) => {
    //       console.log('cart', vs.cart);
    //     },
    //     error: (e) => {
    //       console.error(e)
    //     },
    //     complete: () => {
    //     },
    //   });
  }

  productDetails(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    console.log('woo cart ondestroy');
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
