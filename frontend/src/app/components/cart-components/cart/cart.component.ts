import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { CartActions } from '../../../store/cart/cart.actions';
import { Router, RouterLink } from '@angular/router';
import { LineItem } from 'src/app/shared/blogApi/utils/types/wooCommerceTypes';
import { CartComponentFacade, ICartComponentFacadeModel } from '../cart.component.facade';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class CartComponent implements OnInit, OnDestroy {

  viewState$: Observable<ICartComponentFacadeModel>;

  private facade = inject(CartComponentFacade);

  private store = inject(Store);

  private router = inject(Router);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  ngOnInit() {
  }

  productDetails(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  incrementItem(item: LineItem) {
    this.store.dispatch(new CartActions.IncrementLineItem(item));
  }

  decrementItem(item: LineItem) {
    this.store.dispatch(new CartActions.DecrementLineItem(item));
  }

  removeFromList(item: LineItem) {
    console.log(item);
    this.store.dispatch(new CartActions.RemoveLineItem(item));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
