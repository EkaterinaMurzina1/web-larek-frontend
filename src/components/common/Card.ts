import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { ICard, ICardActions } from '../../types';

export class Card extends Component<ICard> {
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(protected container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector(`.card__text`);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector(`.card__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	render(data?: Partial<ICard>): HTMLElement {
		super.render(data);

		if (data?.category && this._category) {
			this._category.className = this.getCategoryClass(data.category);
			this.setText(this._category, data.category);
		}

		return this.container;
	}

	getCategoryClass(category: string): string {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			дополнительное: 'additional',
			кнопка: 'button',
			другое: 'other',
		};

		const categoryType = categoryMap[category.toLowerCase()] || 'other';
		return `card__category card__category_${categoryType}`;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
  
	set description(value: string | string[]) {
		this.setText(this._description, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: string) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this._button?.setAttribute('disabled', 'disabled');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	get price(): string {
		return this._price.textContent;
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set inBasket(value: boolean) {
		if (this._button) {
			if (value) {
				this._button.innerText = 'Перейти в корзину';
			} else {
				this._button.innerText = 'Добавить в корзину';
			}
		}
	}
}
