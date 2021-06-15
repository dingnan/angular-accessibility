import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  QueryList,
} from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';

@Component({
  selector: 'app-list-item',
  styles: [`
    :host {
      display: block;
      margin: 1rem 0;
      padding: 1rem;
      background-color: #0090FF;
      transition: all 0.3s;
      outline: none;
      color: white;
    }

    :host(:focus) {
      background-color: #28BF5F;
      transform: translateX(1rem);
    }
  `],
  host: { tabindex: '-1' },
  template: `
    <span>{{ fruit }}</span>
  `,
})
export class ListItemComponent implements FocusableOption {
  @Input() fruit: string;
  disabled: boolean;

  constructor(private element: ElementRef) {
  }

  getLabel(): string {
    return this.fruit;
  }

  focus(): void {
    this.element.nativeElement.focus();
  }
}

@Component({
  selector: 'app-list',
  styles: [`
    :host {
      display: block;
      max-width: 30rem;
    }
  `],
  template: `
    <ng-content></ng-content>
  `,
  host: { 'tabindex': '0' },
})
export class ListComponent implements AfterContentInit {
  @ContentChildren(ListItemComponent) items: QueryList<ListItemComponent>;
  private keyManager: FocusKeyManager<ListItemComponent>;

  @HostListener('keydown', ['$event'])
  manage(event: KeyboardEvent) {
    this.keyManager.onKeydown(event);
  }

  ngAfterContentInit(): void {
    this.keyManager = new FocusKeyManager(this.items).withWrap();
  }
}

@Component({
  selector: 'my-app',
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `],
  template: `
    <h1>Fruits</h1>
    <input type='text' />
    <app-list>
      <app-list-item *ngFor="let fruit of fruits" [fruit]="fruit"></app-list-item>
    </app-list>
  `,
})
export class AppComponent  {
  fruits = [
    'Apples',
    'Bananas',
    'Cherries',
    'Dewberries',
    'Blueberries',
    'Avocados',
  ];
}
