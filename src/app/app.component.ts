import { Component, OnInit } from '@angular/core';
import { BBAuth } from '../dist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    BBAuth.getToken({disableRedirect: false}).then(() => console.log('got token')).catch(() => console.warn);
  }
}
