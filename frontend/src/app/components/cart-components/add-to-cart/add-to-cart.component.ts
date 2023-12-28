import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CounterInputComponent } from 'src/app/components/counter-input/counter-input.component';
import { Observable, Subject } from 'rxjs';
import { ICartComponentFacadeModel, CartComponentFacade } from '../cart.component.facade';
import { Product } from 'src/app/shared/blogApi/utils/types/wooCommerceTypes';

@Component({
  selector: 'add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CounterInputComponent
  ]
})
export class AddToCartComponent implements OnInit, OnDestroy {

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  @Input('product') product: Product;

  viewState$: Observable<ICartComponentFacadeModel>;

  private facade = inject(CartComponentFacade);

  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
  }

  addToCart() {
    this.facade.updateCart(this.product, 1);
    // if (this.counterInput?.counterValue > 0) {
    //   this.facade.updateCart(this.product, this.counterInput?.counterValue);
    // }
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
