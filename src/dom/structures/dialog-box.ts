import { Application } from '../../application/structures/application';
import { DOMDisplay } from '../enums/dom-display.enum';
import { DOMElement } from '../enums/dom-element.enum';
import { DOMEvent } from '../enums/dom-event.enum';

export class DialogBox {
  private readonly dialog: HTMLElement;
  private readonly form: HTMLLIElement;
  private readonly input: HTMLInputElement;
  private readonly button: HTMLElement;

  constructor(private readonly application: Application) {
    const form = document.getElementById(DOMElement.FORM);
    const input = document.getElementById(DOMElement.INPUT);
    const button = document.getElementById(DOMElement.BUTTON);
    const dialog = document.getElementById(DOMElement.DIALOG);

    if (!form) {
      throw new Error(`DOM element '${DOMElement.FORM}' not found.`);
    }

    if (!input) {
      throw new Error(`DOM element '${DOMElement.INPUT}' not found.`);
    }

    if (!button) {
      throw new Error(`DOM element '${DOMElement.BUTTON}' not found.`);
    }

    if (!dialog) {
      throw new Error(`DOM element '${DOMElement.DIALOG}' not found.`);
    }

    this.form = form as HTMLLIElement;
    this.input = input as HTMLInputElement;
    this.button = button as HTMLLIElement;
    this.dialog = dialog as HTMLElement;

    this.initListeners();
  }

  private initListeners(): void {
    this.input.addEventListener(DOMEvent.FOCUS, () => this.handleFocusInputName());
    this.button.addEventListener(DOMEvent.CLICK, () => this.handleClickButtonEnter());
  }

  private handleFocusInputName(): void {
    console.log('Focus!');
    this.input.style.borderBottom = '1px solid white';
    this.input.style.color = '#ffffff';
  }

  private handleClickButtonEnter(): void {
    const username = this.input.value;

    if (username === '') {
      this.input.style.borderBottom = '1px solid #ff9090';
      this.input.style.color = '#ff9090';
      return;
    }

    this.setVisibility(false);
    this.application.connect(username);
  }

  private setVisibility(value: boolean) {
    this.dialog.style.display = value ? DOMDisplay.FLEX : DOMDisplay.NONE;
  }
}
