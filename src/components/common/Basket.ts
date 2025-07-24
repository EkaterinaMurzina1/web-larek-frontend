import { Component } from '../base/component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IProduct, IBasketView } from '../../types';

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
		if (items.length) {
			items.forEach((item, index) => {
				const numbering = item.querySelector('.basket__item-index');
				numbering.textContent = `${index + 1}`;
			});
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: IProduct[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсисов`);
	}
}
