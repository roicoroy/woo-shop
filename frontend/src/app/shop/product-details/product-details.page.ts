import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { ProductsActions } from '../../store/products/products.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { AddToCartComponent } from '../../components/cart-components/add-to-cart/add-to-cart.component';
import { IProductsFacadeModel, ProductsFacade } from '../products.facade';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { Product } from 'src/app/shared/blogApi/utils/types/wooCommerceTypes';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AddToCartComponent,
    AppHeaderComponent
  ]
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  pageTitle = 'Product Details';

  product$!: Observable<Product>;

  viewState$: Observable<IProductsFacadeModel>;

  private activatedRoute = inject(ActivatedRoute);

  private store = inject(Store);

  private facade = inject(ProductsFacade);

  private sanitizer = inject(DomSanitizer);

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string
    if (id) {
      this.store.dispatch(new ProductsActions.GetProductById(id));
    }
  }

  sanitise(content: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(content);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ProductsActions.RemoveSelectedProduct);
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
