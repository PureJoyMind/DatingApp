import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  model: any = {}
  cancelRegister = output<boolean>();
  register(){
    this.accountService.register(this.model).subscribe({
      next: res => {
        this.cancel()
      },
      error: error => console.log(error)
      
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
