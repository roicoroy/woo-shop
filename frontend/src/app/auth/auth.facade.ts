import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState, IUserResponseModel } from '../store/auth/auth.state';

export interface ILoginFacadeState {
    isLoggedIn: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$!: Observable<boolean>;

    @Select(AuthState.getUser) user$!: Observable<IUserResponseModel | any>;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.user$
            ]
        )
            .pipe(
                map((
                    isLoggedIn,
                    user,
                ) => ({
                    isLoggedIn,
                    user: user
                }))
            );
    }
}
