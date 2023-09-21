import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// translations
import en from 'assets/locales/en.json';

@Injectable()
export class LocaleService {
  private _t: any;
  private _currentLocale: string = 'en';

  constructor() {
    this._t = en;
  }

  get currentLocale(): string {
    return this._currentLocale;
  }

  get t(): any {
    return this._t;
  }

  setLocale(locale: string): void {
    this._currentLocale = locale;
    this._t = locale === "en" ? en : {};
  }
}
