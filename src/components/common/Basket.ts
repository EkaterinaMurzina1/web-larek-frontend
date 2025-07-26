import { Component } from '../base/component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView } from '../../types';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this.setDisabled(this._button, true);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length <= 0) {
			this._button.disabled = true;
			this._list.replaceChildren(
				createElement<HTMLElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		} else {
			this._button.disabled = false;
			this._list.replaceChildren(...items);
		}
	}

	set isButtonDisabled(value: boolean) {
		this.setDisabled(this._button, value);
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}
}
