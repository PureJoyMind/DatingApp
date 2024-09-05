import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  title = 'DatingApp';
  users: any;
  ngOnInit(): void {
    const users = this.http.get("https://localhost:5001/api/users").subscribe({
      next: res => this.users = res,
      error: error => console.log(error),
      complete: () => console.log("Request complete", users),      
    });
    
  }
}
