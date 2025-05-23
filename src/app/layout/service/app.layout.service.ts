import { Injectable, effect, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    _config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14,
    };

    config = signal<AppConfig>(this._config);

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    private configUpdate = new Subject<AppConfig>();
    private overlayOpen = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();
    overlayOpen$ = this.overlayOpen.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: Document) {
        effect(() => {
            const config = this.config();
            if (this.updateStyle(config)) {
                this.changeTheme();
            }
            this.changeScale(config.scale);
            this.onConfigUpdate();
        });
    }

    updateStyle(config: AppConfig) {
        return (
            config.theme !== this._config.theme ||
            config.colorScheme !== this._config.colorScheme
        );
    }
    
    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive =
                !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive =
                !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }
    
    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config().menuMode === 'overlay';
    }

    isDesktop() {
        return isPlatformBrowser(this.platformId) && window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this._config = { ...this.config() };
        this.configUpdate.next(this.config());
    }

    changeTheme() {
        // Solo ejecutamos este código en el navegador
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                const config = this.config();
                const themeLink = this.document.getElementById('theme-css') as HTMLLinkElement;
                if (themeLink) {
                    const themeLinkHref = themeLink.getAttribute('href');
                    if (themeLinkHref) {
                        const newHref = themeLinkHref
                            .split('/')
                            .map((el) =>
                                el === this._config.theme
                                    ? (el = config.theme)
                                    : el === `theme-${this._config.colorScheme}`
                                    ? (el = `theme-${config.colorScheme}`)
                                    : el
                            )
                            .join('/');

                        this.replaceThemeLink(newHref);
                    }
                }
            });
        }
    }

    replaceThemeLink(href: string) {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                const id = 'theme-css';
                let themeLink = this.document.getElementById(id) as HTMLLinkElement;
                if (themeLink) {
                    const cloneLinkElement = this.document.createElement('link');
                    cloneLinkElement.setAttribute('rel', 'stylesheet');
                    cloneLinkElement.setAttribute('href', href);
                    cloneLinkElement.setAttribute('id', id + '-clone');

                    themeLink.parentNode!.insertBefore(
                        cloneLinkElement,
                        themeLink.nextSibling
                    );

                    cloneLinkElement.addEventListener('load', () => {
                        themeLink.remove();
                        cloneLinkElement.setAttribute('id', id);
                    });
                }
            });
        }
    }

    changeScale(value: number) {
        // Solo ejecutamos este código en el navegador
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                this.document.documentElement.style.fontSize = `${value}px`;
            });
        }
    }
}
