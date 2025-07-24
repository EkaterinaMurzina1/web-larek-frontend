import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import {ISuccessOrder, ISuccessActions} from '../../types'

export class Success extends Component<ISuccessOrder> {
  protected _close: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(protected container: HTMLElement, actions: ISuccessActions, total: number) {
    super(container);

 this._description = ensureElement< HTMLElement>('.order-success__description', this.container);
 this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
 this._description.textContent = `Списано ${total} синапсов`;

    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }
}