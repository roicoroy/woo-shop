import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { WPost } from './utils/types/postType';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  constructor(public http: HttpClient) { }

  getPost(postId: any): Observable<WPost> {
    return this.http.get<WPost>(
      environment.wordpress.api_url
      + "posts/" + postId)
  }

  getRecentPosts(categoryId: any, page: number = 1) {
    console.log(categoryId);
    // if we want to query posts by category
    let category_url = categoryId ? ("&categories=" + categoryId) : "";

    // console.log(category_url);

    return this.http.get(
      environment.wordpress.api_url
      + 'posts?page=' + page
      + '&orderby=modified' // order by last modified date
      + category_url)
      .pipe(
        map((posts: any) => {
          posts.forEach((post: any) => {
            // we remove the "read more" link that the excerpt contains.
            // this is optional, you can remove this line if you want.
            post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          })
          return posts;
        })
      )
  }

  getComments(postId: number, page: number = 1) {
    return this.http.get(
      environment.wordpress.api_url
      + "comments?post=" + postId
      + '&page=' + page);
  }

  getAuthor(author: any) {
    return this.http.get(environment.wordpress.api_url + "users/" + author)
  }

  getPostCategories(post: any) {
    let observableBatch: any = [];
    post.categories.forEach((category: number) => {
      observableBatch.push(this.getCategory(category));
    });

    return forkJoin(observableBatch);
  }

  getCategory(category: number) {
    return this.http.get(environment.wordpress.api_url + "categories/" + category)
  }

  createComment(postId: number, user: any, comment: string) {
    let header: HttpHeaders = new HttpHeaders().append('Authorization', 'Bearer ' + user.token);
    return this.http.post(environment.wordpress.api_url + "comments", {
      author_name: user.displayname,
      author_email: user.email,
      post: postId,
      content: comment
    }, { headers: header })
  }
}
