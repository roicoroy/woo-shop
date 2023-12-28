import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../store/auth/auth.state';
import { BlogState } from '../store/blog/blog.state';
import { WPost } from '../shared/blogApi/utils/types/postType';

export interface IBlogFacadeModel {
    isLoggedIn: boolean;
    posts: WPost[];
    post: any;
}

@Injectable({
    providedIn: 'root'
})
export class BlogFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    @Select(BlogState.getPostsFromState) posts$: Observable<WPost[]>;

    @Select(BlogState.getPost) post$: Observable<WPost>;

    readonly viewState$: Observable<IBlogFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.posts$,
                this.post$,
            ]
        )
            .pipe(
                map((
                    [
                        isLoggedIn,
                        posts,
                        post,
                    ]
                ) => (
                    {
                        isLoggedIn,
                        posts,
                        post,
                    }
                ))
            ) as any;
    }
}
