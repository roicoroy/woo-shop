import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CartIconComponent } from '../../cart-components/cart-icon/cart-icon.component';

import { Billing, Shipping } from 'src/app/shared/wooApi';

@Component({
  selector: 'address-view',
  templateUrl: './address-view.component.html',
  styleUrls: ['./address-view.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CartIconComponent
  ]
})
export class AddressViewComponent  implements OnInit {

  @Input() address!: Billing | Shipping;

  constructor() { }

  ngOnInit() {}
  
  ionViewDidEnter(){
    console.log(this.address);
  }

}
