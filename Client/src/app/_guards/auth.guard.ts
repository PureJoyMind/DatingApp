import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

// this is a route guard and we must configure each route that needs in the app.routes.ts file
export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  if(!accountService.currentUser()){
    toastr.error("You don't have access to that!");
    return false;
  }

  return true;
};
