import { Form } from './Form';
import { IOrder } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';

export class Order extends Form<IOrder> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _currentSelection: string | null = null;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.selected = button.name;
			});
		});

		events.on('modal:close', () => {
			this.removeSelected();
		});
	}

	protected removeSelected() {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
		this._currentSelection = null;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set selected(name: string) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
		this.events.emit('payment:change', { name });
	}
}
