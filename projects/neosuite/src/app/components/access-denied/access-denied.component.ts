import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  constructor( private authService: AuthService) { }

  ngOnInit() {
  }
  
  logout() {
     // this.authService.loginAccess = true;
      this.authService.logout();

  }

}
