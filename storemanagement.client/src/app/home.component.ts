import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h1>Welcome to Store Management</h1>
      <p>Angular 16 with Bootstrap and Material Design is working!</p>
      <div class="alert alert-success" role="alert">
        Bootstrap is working!
      </div>
      <button class="btn btn-primary" onclick="location.href='/login'">Go to Login</button>
    </div>
  `,
  styles: []
})
export class HomeComponent { }
