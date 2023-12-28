import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from 'src/app/shared/blogApi/utils/types/wooCommerceTypes';
import { AuthState } from 'src/app/store/auth/auth.state';

export interface IAppHeaderFacadeModel {
    isLoggedIn: boolean;
    user: Customer
}

@Injectable({
    providedIn: 'root'
})
export class AppHeaderFacade {

    @Select(AuthState.getUser) user$: Observable<Customer>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    readonly viewState$: Observable<IAppHeaderFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.user$,
                this.isLoggedIn$,
            ]
        ).pipe(
            map((
                [
                    user,
                    isLoggedIn,]
            ) => ({
                user,
                isLoggedIn,
            }))
        );
    }
}
