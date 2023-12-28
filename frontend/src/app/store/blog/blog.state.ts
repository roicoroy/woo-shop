import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BlogActions } from './blog.action';
import { WordpressService } from 'src/app/shared/blogApi/wordpress.service';
import { concatMap, forkJoin, map } from 'rxjs';
import { WPost } from 'src/app/shared/blogApi/utils/types/postType';

export class BlogStateModel {
    posts: WPost[];
    post: WPost;
}

@State<BlogStateModel>({
    name: 'blog',
    defaults: {
        posts: null,
        post: null,
    }
})
@Injectable()
export class BlogState {

    private wordpressService = inject(WordpressService);

    @Selector()
    static getPostsFromState(state: BlogStateModel): WPost[] {
        return state.posts;
    }

    @Selector()
    static getPost(state: BlogStateModel): WPost {
        return state.post;
    }

    @Action(BlogActions.GetPosts)
    getPosts(ctx: StateContext<BlogStateModel>, { categoryId }: BlogActions.GetPosts) {
        const state = ctx.getState();
        // console.log(isDarkMode);
        return this.wordpressService.getRecentPosts(categoryId)
            .pipe(
                map((posts) => {
                    return ctx.patchState({
                        posts,
                    });
                }),
            );
    }

    @Action(BlogActions.GetPostById)
    getPostById(ctx: StateContext<BlogStateModel>, { id }: BlogActions.GetPostById) {
        return this.wordpressService.getPost(id)
            .pipe(
                concatMap((post: WPost) => {
                    const author = this.wordpressService.getAuthor(post.author);
                    const categories = this.wordpressService.getPostCategories(post);
                    const comments = this.wordpressService.getComments(post.id);
                    return forkJoin({ author, categories, comments })
                        .pipe(
                            map((postData: any) => {
                                const data = { ...postData, post };
                                // console.log(data);

                                return ctx.patchState({
                                    post: data,
                                });
                            })
                        );
                })
            );
    }

    @Action(BlogActions.ClearPostFromState)
    clearPostFromState(ctx: StateContext<BlogStateModel>) {
        const state = ctx.getState();
        return ctx.patchState({
            ...state,
            post: null,
        });
    }

}
