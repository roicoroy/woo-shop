import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { WordpressService } from 'src/app/shared/blogApi/wordpress.service';
import { BlogActions } from 'src/app/store/blog/blog.action';

@Injectable({
    providedIn: 'root'
})
export class PostResolver implements Resolve<any> {

    private store = inject(Store);

    constructor(
        private wordpressService: WordpressService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        const id = route.paramMap.get('id');
        this.store.dispatch(new BlogActions.GetPostById(id));
        this.wordpressService.getComments(Number(id));
    }
}
