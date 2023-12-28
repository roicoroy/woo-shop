import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BlogFacade, IBlogFacadeModel } from '../blog.facade';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink,
  ]
})
export class PostsPage implements OnInit, OnDestroy {

  posts: Array<any> = new Array<any>();

  categoryId!: number;

  categoryTitle!: string;

  viewState$!: Observable<IBlogFacadeModel>;

  private facade = inject(BlogFacade);

  private readonly ngUnsubscribe = new Subject();

  constructor(
  ) {
    this.viewState$ = this.facade.viewState$;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
