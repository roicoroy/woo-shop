import { Injectable, inject } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WoocommerceHelperService } from './wooApi';
import { Store } from '@ngxs/store';
import { IStoreSnapshoModel } from '../store/store.snapshot.interface';

@Injectable()
export class WooInterceptor implements HttpInterceptor {
    private wooHelper = inject(WoocommerceHelperService);

    constructor(
        private store: Store,
    ) { }

    public includeWooAuth(url: string): string {
        const wooAuth = `consumer_key=${environment.woocommerce.consumer_key}&consumer_secret=${environment.woocommerce.consumer_secret}`;
        const hasQuery = url.includes('?');
        let returnUrl = '';
        if (hasQuery) {
            returnUrl = wooAuth;
        } else {
            returnUrl = '?' + wooAuth;
        }
        return returnUrl;
    }

    public includeWooAuthV3(url: string): string {
        const wooAuth = `consumer_key=${environment.woocommerce.consumer_key}&consumer_secret=${environment.woocommerce.consumer_secret}`;
        const hasQuery = url.includes('?');
        let returnUrl = '';
        if (hasQuery) {
            returnUrl = wooAuth;
        } else {
            returnUrl = '?' + wooAuth;
        }
        return returnUrl;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest;
        let requestUrl = '';

        const token = this.store.selectSnapshot((state: IStoreSnapshoModel) => state.auth.user?.token);
        // console.log(request.url);
        if (request.url.includes('i18n')) {
            authRequest = request.clone({
                url: request.url
            });
            return next.handle(authRequest)
                .pipe(
                    catchError(err => {
                        if (err instanceof HttpErrorResponse && err.status === 0) {
                            this.wooHelper.handleError(err);
                        } else if (err instanceof HttpErrorResponse && err.status === 401) {
                            this.wooHelper.handleError(err);
                        }
                        return throwError(err);
                    })
                );
        }
        if (request.url.includes('api') || request.url.includes('jwt') || request.url.includes('wp-json')) {
            requestUrl = `${environment.origin}/${request.url}`;
            if (token) {
                authRequest = request.clone({
                    headers: new HttpHeaders({ "Authorization": "Bearer " + token }),
                    url: requestUrl
                });
            } else {
                authRequest = request.clone({
                    url: requestUrl
                });
            }
        }
        if (
            request.url.includes('customers') ||
            request.url.includes('shipping_methods') ||
            request.url.includes('zones') ||
            request.url.includes('classes') ||
            request.url.includes('orders') ||
            request.url.includes('create-payment-intent') ||
            request.url.includes('shipping/zones') ||
            request.url.includes('payment_gateways')
        ) {
            requestUrl = `${environment.origin}${environment.wc3Endpoint}/${request.url}${this.includeWooAuth(request.url)}`;
            authRequest = request.clone({
                url: requestUrl
            });
            return next.handle(authRequest)
                .pipe(
                    catchError(err => {
                        if (err instanceof HttpErrorResponse && err.status === 0) {
                            this.wooHelper.handleError(err);
                        } else if (err instanceof HttpErrorResponse && err.status === 401) {
                            this.wooHelper.handleError(err);
                        }
                        return throwError(err);
                    })
                );
        }
        if (
            request.url.includes('stripe-payment') ||
            request.url.includes('products')
            ) {
            requestUrl = `${environment.origin}${environment.wcEndpoint}/${request.url}${this.includeWooAuth(request.url)}`;
            authRequest = request.clone({
                url: requestUrl
            });
        } else {
            authRequest = request.clone({
                url: `${environment.origin}/${request.url}`
            });
        }

        return next.handle(authRequest)
            .pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse && err.status === 0) {
                        this.wooHelper.handleError(err);
                    } else if (err instanceof HttpErrorResponse && err.status === 401) {
                        this.wooHelper.handleError(err);
                    }
                    return throwError(err);
                })
            );
    }
}
