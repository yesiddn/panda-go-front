import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Token } from '../../../../services/token';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Auth } from '../../../../services/auth';
import { UserInfo } from '../../../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, BadgeModule, AvatarModule, Menu, RippleModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  private token = inject(Token);
  private router = inject(Router);
  private auth = inject(Auth);
  items: MenuItem[] = [];
  userInfo: UserInfo | null = null;
  role: string | null = null;

  get isLoggedIn(): boolean {
    return this.token.isValidToken();
  }

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit() {
    // build initial menu (without role-specific entries)
    this.buildMenu();

    // fetch user info and rebuild menu when role is available
    this.auth.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
        this.role = userInfo.groups && userInfo.groups.length ? userInfo.groups[0] : null;
        // Rebuild menu to include role-specific items
        this.buildMenu();
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
      }
    });
  }

  // Build the menu items; called initially and after userInfo/role is loaded
  private buildMenu() {
    const base: MenuItem[] = [
      { separator: true },
      {
        label: 'Solicitudes de recolección',
        items: [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
        ]
      }
    ];

    // If user is employee, add Rutas section right after Solicitudes
    if (this.role === 'employee') {
      base.push({
        label: 'Rutas',
        items: [
          {
            label: 'Administrar rutas',
            icon: 'pi pi-map',
            routerLink: ['/app/rutas']
          }
        ]
      });
    }

    // Profile section always at the end
    base.push(
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog' },
          { label: 'Messages', icon: 'pi pi-inbox', badge: '2' },
          { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
        ]
      },
      { separator: true }
    );

    this.items = base;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
