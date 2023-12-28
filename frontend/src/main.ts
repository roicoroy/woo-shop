import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
// HTTTP
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
// Traanslate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Keypad
import { KeypadModule } from './app/shared/native/keyboard/keypad.module';
// Store
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
// image helper
import { IMAGE_CONFIG } from '@angular/common';
// interceptor
import { WooInterceptor } from './app/shared/woo.interceptor';
// Ionic storage
import { IonicStorageModule } from '@ionic/storage-angular';
// states
import { AddressesState } from './app/store/addresses/addresses.state';
import { AuthState } from './app/store/auth/auth.state';
import { CartState } from './app/store/cart/cart.state';
import { CheckoutTabsState } from './app/store/checkout/checkout.state';
import { CustomerState } from './app/store/customer/customer.state';
import { ErrorsLoggingState } from './app/store/errors-logging/errors-logging.state';
import { KeyboardState } from './app/store/keyboard/keyboard.state';
import { OrdersState } from './app/store/orders/orders.state';
import { PaymentState } from './app/store/payment/payment.state';
import { ProductsState } from './app/store/products/products.state';
import { SettingsState } from './app/store/settings/settings.state';
import { ShippingState } from './app/store/shipping/shipping.state';
import { BlogState } from './app/store/blog/blog.state';
// 
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'en' },
    {
      // https://angular.io/guide/image-directive
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WooInterceptor,
      multi: true
    },
    provideIonicAngular(),
    provideAnimationsAsync(),
    importProvidersFrom(
      HttpClientModule,
      KeypadModule,
      IonicStorageModule.forRoot(),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => {
            return new TranslateHttpLoader(http, './assets/i18n/', '.json');
          },
          deps: [HttpClient]
        }
      }),
      NgxsModule.forRoot(
        [
          AuthState,
          CustomerState,
          ProductsState,
          SettingsState,
          ErrorsLoggingState,
          KeyboardState,
          CheckoutTabsState,
          CartState,
          AddressesState,
          ShippingState,
          PaymentState,
          OrdersState,
          BlogState
        ],
        { developmentMode: false }
      ),
      NgxsStoragePluginModule.forRoot({
        key: [
          'auth',
          'customer',
          'products',
          'settings',
          'errors',
          'keyboard',
          'checkoutTabs',
          'cart',
          'addresses',
          'shipping',
          'payment',
          'orders',
          'blog'
        ]
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsLoggerPluginModule.forRoot({
        disabled: true,
      }),
      NgxsFormPluginModule.forRoot(),
    ),
    provideRouter(routes),
  ],
});


