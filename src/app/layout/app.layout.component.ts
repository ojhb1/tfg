import { Component, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from "./service/app.layout.service";
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppTopBarComponent } from './app.topbar.component';
import { CommonModule } from '@angular/common';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigComponent } from './config/app.config.component';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AppTopBarComponent,
        AppSidebarComponent,
        AppFooterComponent,
        AppConfigComponent,
    ],
    selector: 'app-layout',
    templateUrl: './app.layout.component.html'
})
export class AppLayoutComponent implements OnDestroy {

    overlayMenuOpenSubscription: Subscription;
    menuOutsideClickListener: any;
    profileMenuOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(
        public layoutService: LayoutService,
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router,
        @Inject(DOCUMENT) private document: Document // Inyectamos el documento de Angular
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (isPlatformBrowser(this.platformId)) {
                // Usamos el document de Angular para manipular el DOM
                if (!this.menuOutsideClickListener) {
                    this.menuOutsideClickListener = this.document.addEventListener('click', event => {
                        const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
                            || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));

                        if (isOutsideClicked) {
                            this.hideMenu();
                        }
                    });
                }

                if (!this.profileMenuOutsideClickListener) {
                    this.profileMenuOutsideClickListener = this.document.addEventListener('click', event => {
                        const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                            || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

                        if (isOutsideClicked) {
                            this.hideProfileMenu();
                        }
                    });
                }
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideProfileMenu();
            });
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.document.removeEventListener('click', this.menuOutsideClickListener);
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
        this.layoutService.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.document.removeEventListener('click', this.profileMenuOutsideClickListener);
            this.profileMenuOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        if (this.document.body.classList) {
            this.document.body.classList.add('blocked-scroll');
        } else {
            this.document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (this.document.body.classList) {
            this.document.body.classList.remove('blocked-scroll');
        } else {
            this.document.body.className = this.document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config().colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
            'layout-overlay': this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config().inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config().ripple
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.document.removeEventListener('click', this.menuOutsideClickListener);
        }
    }
}
