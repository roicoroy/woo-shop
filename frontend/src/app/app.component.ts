import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngxs/store';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, call, camera, cameraOutline, cog, cogOutline, home, homeOutline, mail, menu, menuOutline, storefront, storefrontOutline, thumbsUp, thumbsUpOutline, homeSharp, heart, share, create, add, cart, checkmarkOutline, arrowBack, wallet, bicycle, book, triangle, remove, informationCircleOutline, eyeOffOutline, eyeOutline, card, storefrontSharp, cogSharp, arrowBackOutline, arrowBackSharp } from 'ionicons/icons';

import { Observable, Subject } from 'rxjs';
import { AppFacade, IAppFacadeModel } from './app.facade';
import { Platform } from '@ionic/angular';
import { NavigationService } from './shared/utils/navigation.service';
import { FcmService } from './shared/fcm.service';
import { LanguageService } from './shared/language/language.service';
import { KeyboardService } from './shared/native/keyboard/keyboard.service';
import { ThemeService } from './shared/utils/theme.service';
import { ProductsActions } from './store/products/products.actions';
import { CustomerActions } from './store/customer/customer.actions';
import { CartComponent } from './components/cart-components/cart/cart.component';
import { CustomerState } from './store/customer/customer.state';
import { ProductsState } from './store/products/products.state';
import { IonicModule } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthActions } from './store/auth/auth.actions';
import { AuthState } from './store/auth/auth.state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    CartComponent
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Woo', url: '/product-list', icon: 'storefront' },
    { title: 'Blog', url: '/posts', icon: 'archive' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
    { title: 'Profile', url: '/profile', icon: 'cog' },
  ];

  viewState$!: Observable<IAppFacadeModel>;

  private store = inject(Store);

  private router = inject(Router);

  private facade = inject(AppFacade);

  public platform = inject(Platform);

  private language = inject(LanguageService);

  private theme = inject(ThemeService);

  private keyboardService = inject(KeyboardService);

  private fcm = inject(FcmService);

  private navigationsService = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  constructor(
    public menu: MenuController,
  ) {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe(vs=>{
    //   console.log('@@@@:: ', vs);
    // });
  }

  checkoutPage() {
    this.navigationsService.navigateFlip('/checkout/cart-review').then(() => {
      // this.menu.toggle('endmenu');
    });
  }

  homePage() {
    this.navigationsService.navigateFlip('/home');
  }

  async ngOnInit() {
    await this.appInit();
  }

  async appInit() {
    try {
      this.iconsInit();

      this.language.initTranslate();

      this.theme.themeInit();

      if (this.platform.is('hybrid')) {
        if (this.platform.is('android') || this.platform.is('ios')) {
          this.keyboardService.setAccessoryBarVisible(true).catch(() => { });
          this.keyboardService.initKeyboardListeners();
          this.fcm.listenersPushInit();
        }
      }

      this.store.dispatch(new AuthActions.RefresUserState());

      const products = this.store.selectSnapshot(ProductsState.getProducts);
      if (!products) {
        this.store.dispatch(new ProductsActions.RetrieveProducts());
      }

      const allCustomers = this.store.selectSnapshot(CustomerState.getAllCustomers);
      if (!allCustomers) {
        this.store.dispatch(new CustomerActions.RetrieveAllCustomers());
      }

      const customerOrders = this.store.selectSnapshot(CustomerState.getCustomerOrders);
      if (!customerOrders) {
        this.store.dispatch(new CustomerActions.GetCustomerOrders());
      }

      const user = this.store.selectSnapshot(AuthState.getUser);
      if (!user) {
        this.store.dispatch(new CustomerActions.RetrieveCustomer(user));
      }

    } catch (err) {
      console.error(err);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.AuthLogout());
    this.router.navigateByUrl('login')
  }

  iconsInit() {
    return addIcons({
      arrowBackSharp,
      arrowBackOutline,
      arrowBack,
      remove,
      storefrontSharp,
      cogSharp,
      cart,
      card,
      create,
      informationCircleOutline,
      add,
      share,
      homeSharp,
      home,
      storefront,
      camera,
      heart,
      menu,
      mail,
      cog,
      thumbsUp,
      homeOutline,
      storefrontOutline,
      cameraOutline,
      menuOutline,
      mailOutline,
      cogOutline,
      thumbsUpOutline,
      call,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      heartOutline,
      heartSharp,
      archiveOutline,
      archiveSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      bookmarkOutline,
      bookmarkSharp,
      checkmarkOutline,
      wallet,
      book,
      triangle,
      bicycle,
      eyeOffOutline,
      eyeOutline


    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}

