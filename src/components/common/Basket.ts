import { Component } from '../base/component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IProduct, IBasketView } from '../../types';
import { IBasketItem } from '../../types';

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
		this._list.replaceChildren(...items);

		if (items.length <= 0) {
			this._button.disabled = true;
			this._list.replaceChildren(
				createElement<HTMLElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		} else {
			this._button.disabled = false;
		}
	}

	set isButtonDisabled(value: boolean) {
		this.setDisabled(this._button, value);
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}

	updateIndex() {
		Array.from(this._list.children).forEach((item, index) => {
			const numbering = item.querySelector('.basket__item-index');
			if (numbering) {
				numbering.textContent = (index + 1).toString();
			}
		});
	}
}

export class BasketItem extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, protected events?: EventEmitter) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.basket__item-title', container);
		this._price = ensureElement<HTMLElement>('.basket__item-price', container);
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}
}
