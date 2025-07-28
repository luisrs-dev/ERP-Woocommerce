import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../angular-material/material.module';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: true,
  imports: [MaterialModule]
})
export default class InventoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
