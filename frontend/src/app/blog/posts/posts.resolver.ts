import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { BlogState } from '../../store/blog/blog.state';
import { BlogActions } from '../../store/blog/blog.action';

@Injectable({
    providedIn: 'root'
})
export class PostsResolver implements Resolve<any> {

    private store = inject(Store);

    resolve(route: ActivatedRouteSnapshot) {
        const categoryId = route.queryParams['categoryId'];
        const categoryTitle = route.queryParams['title'];
        // console.log(categoryId);
        // console.log(categoryTitle);
        const savedPosts = this.store.selectSnapshot(BlogState.getPostsFromState);
        if (!savedPosts) {
            this.store.dispatch(new BlogActions.GetPosts(categoryId));
        }
        const statePost = this.store.selectSnapshot(BlogState.getPost);
        if(statePost){
            this.store.dispatch(new BlogActions.ClearPostFromState());
        }
    }
}
