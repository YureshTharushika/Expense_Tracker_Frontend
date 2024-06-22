import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
    selector: 'app-app-layout',
    standalone: true,
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.css',
    imports: [RouterOutlet, SidebarComponent]
})
export class AppLayoutComponent {

}
