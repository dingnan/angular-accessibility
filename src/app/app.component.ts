import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { FocusableOption, FocusKeyManager, Highlightable } from '@angular/cdk/a11y';
import { UP_ARROW, DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-list-item',
  styles: [`
    :host {
      display: block;
      margin: 1rem 0;
      padding: 1rem;
      transition: all 0.3s;
      outline: none;
    }

    :host(:focus) {
      background-color: lightgray;
      cursor: pointer;
      text-decoration: underline;
    }
  `],
  host: { tabindex: '-1' },
  template: `
    <span>{{ item }}</span>
  `,
})
export class ListItemComponent implements FocusableOption, Highlightable {

  @Input() item: string;
  @Output() itemSelected = new EventEmitter<any>();

  private _isActive = false;

  constructor(private element: ElementRef) {
  }

  getLabel(): string {
    return 'label' + Math.random();
  }

  focus(): void {
    this.element.nativeElement.focus();
  }

  @HostBinding('class.active') get isActive() {
    return this._isActive;
  }

  // TODO:
  // Highlightable: This is the interface for highlightable items (used by the ActiveDescendantKeyManager).
  setActiveStyles() {
    this._isActive = true;
  };

  setInactiveStyles() {
    this._isActive = false;
  }

  selectItem() {
    this.itemSelected.emit(this.item);
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
  public keyManager: FocusKeyManager<ListItemComponent>;

  @HostListener('keydown', ['$event'])
  manage(event: KeyboardEvent) {
    this.keyManager.onKeydown(event);
    const { target, key } = event;
    event.stopImmediatePropagation();
    if (key === 'Enter') {
      // when we hit enter, the keyboardManager should call the selectItem method of the `ListItemComponent`
      this.keyManager.activeItem?.selectItem();
    }
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
    <input type='text' [value]="address" (keyup)="handleKeydown($event)"/>
    <form>
    <app-list *ngIf="fruits.length">
      <app-list-item (click)="handleClick(fruit)" *ngFor="let fruit of fruits" [item]="fruit" (itemSelected)="showSelected($event)">></app-list-item>
      <app-list-item (click)="handleClick('clear')" [item]="'Clear'" (itemSelected)="clearField()">></app-list-item>
    </app-list>
    </form>
    <div><input type="text" /></div>
    <div style="padding-top: 1rem;"><button (click)="handleClick($event)">click me</button></div>
  `,
})
export class AppComponent  {
  @ViewChild(ListComponent) addressList: ListComponent;
  address:string = '';
  fruits = [
    'Apples',
    'Bananas',
    'Cherries',
    'Dewberries',
    'Blueberries',
    'Avocados',
  ];

  handleKeydown(event: KeyboardEvent) {
    const { target, key } = event;
    event.stopImmediatePropagation();
    if (this.addressList?.keyManager) {
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        // passing the event to key manager so we get a change fired
        this.addressList.keyManager.onKeydown(event);
      }
    }
  }

  handleClick(event: any) {
    console.log('clicked...', event);
    this.showSelected(event);
  }

  showSelected(event: any) {
    this.address = event;
    this.fruits = [];
  }

  clearField() {
    this.address = '';
    this.fruits = [];
  }
}
