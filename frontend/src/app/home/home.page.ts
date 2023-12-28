import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class HomePage {

  constructor(
    private router: Router
  ) { }

  shopPage() {
    this.router.navigateByUrl('shop');
  }
  
  postsPage() {
    this.router.navigateByUrl('posts');
  }

}

