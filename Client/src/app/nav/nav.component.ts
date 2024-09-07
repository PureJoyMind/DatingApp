import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { NgIf } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  accountService = inject(AccountService);

  model: any = {};

  login() {
    this.accountService.login(this.model).subscribe({
      next: res => {
        console.log(res);
      },
      error: error => console.log(error),
      complete: () => console.log("Request complete"),
    });
  }

  logout() {
    this.accountService.logout()
  }
}
