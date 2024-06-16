import { Component } from '@angular/core';
import { faCalendarAlt, faChartLine, faChartPie, faMoneyCheckAlt, faReceipt, faTachometerAlt, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

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

}
