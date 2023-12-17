import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css',
})
/**
 * Represents the BreadcrumbsComponent class.
 * This component is responsible for displaying breadcrumbs based on the current URL.
 */
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateBreadcrumbs();
    this.router.events.subscribe(() => this.updateBreadcrumbs());
  }

  /**
   * Updates the breadcrumbs based on the current router URL.
   */
  private updateBreadcrumbs(): void {
    const { url } = this.router;

    if (!url.startsWith('/databases')) {
      return;
    }

    const parts = url.split('/').slice(1);
    this.breadcrumbs = [
      {
        label: 'Databases',
        url: parts.length > 1 ? '/databases' : undefined,
      },
    ];

    if (parts.length > 1) {
      this.breadcrumbs.push({
        label: parts[1],
        url: parts.length > 2 ? `/databases/${parts[1]}` : undefined,
      });
    }

    if (parts.length > 2) {
      this.breadcrumbs.push({
        label: parts[2],
      });
    }
  }
}
