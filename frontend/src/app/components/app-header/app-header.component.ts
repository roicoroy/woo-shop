import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AppHeaderFacade, IAppHeaderFacadeModel } from './app-header.facade';
import { NavigationService } from 'src/app/shared/utils/navigation.service';
import { MenuController } from '@ionic/angular';
import { CartIconComponent } from '../cart-components/cart-icon/cart-icon.component';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CartIconComponent
  ]
})
export class AppHeaderComponent implements OnInit {

  @Input() pageTitle!: string;

  @Input() avatar: string;
  
  @Input() menuId: string;

  private facade = inject(AppHeaderFacade);

  viewState$: Observable<IAppHeaderFacadeModel>;

  constructor(
    private navigation: NavigationService,
    public menu: MenuController,
  ) {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((vs) => {
    //   console.log(vs);
    // });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log(this.pageTitle);
  }

  toggleMenu(menuId: string = 'startmenu') {
    this.menu.toggle(menuId);
  }
  
  home() {
    this.navigation.navigateForward('/home', 'forward');
  }
  
  login() {
    this.navigation.navControllerDefault('/auth/pages/auth-home');
  }
  
  logout() {
  }

}
