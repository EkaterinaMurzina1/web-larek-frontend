import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IPage } from '../../types';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basketBtn: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basketBtn = ensureElement<HTMLElement>('.header__basket');

		this._basketBtn.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
