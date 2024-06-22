import { Component } from '@angular/core';
import { faCalendarAlt, faChartLine, faChartPie, faMoneyCheckAlt, faReceipt, faSignOutAlt, faTachometerAlt, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  faTachometerAlt = faTachometerAlt;
  faReceipt = faReceipt;
  faChartPie = faChartPie;
  faCalendarAlt = faCalendarAlt;
  faWallet = faWallet;
  faChartLine = faChartLine;
  faMoneyCheckAlt = faMoneyCheckAlt;
  faSignOutAlt = faSignOutAlt;

  constructor(
    private authService: AuthService,
    private router: Router
    
    ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
    }

}
