import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { FocusableOption, FocusKeyManager, Highlightable, ListKeyManager } from '@angular/cdk/a11y';
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
    .item--active {
      background-color: lightgray;
      cursor: pointer;
      text-decoration: underline;
    }
  `],
  template: `
    <span [class.item--active]="isActive">{{ item }}</span>
  `,
})
export class ListItemComponent implements OnInit {
  // TODO
  // this version does not work with NVDA, since there is no focus
  @Input() item: string;
  @Output() itemSelected = new EventEmitter<any>();

  isActive = false;

  constructor() { }

  ngOnInit() {
    this.isActive = false;
  }

  setActive(val: boolean) {
    this.isActive = val;
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
  public keyManager: ListKeyManager<any>;

  ngAfterContentInit(): void {
    this.keyManager = new ListKeyManager<any>(this.items).withWrap();
    this.initKeyManagerHandlers();
  }
  

  initKeyManagerHandlers() {
    this.keyManager
      .change
      .subscribe((activeIndex) => {
        // when the navigation item changes, we get new activeIndex
        this.items.map((item, index) => {
          // set the isActive `true` for the appropriate list item and `false` for the rest
          item.setActive(activeIndex === index);
          return item;
        });
      });
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
      else if(key === 'Enter') {
        this.addressList.keyManager.activeItem?.selectItem();
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
