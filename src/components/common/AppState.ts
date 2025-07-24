import { Model } from '../base/model';
import {
	IProduct,
	IOrder,
	IOrderForm,
	FormErrors,
	IAppState,
	IContactsForm,
} from '../../types';

export class AppState extends Model<IAppState> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	loading: boolean;
	order: IOrder = {
		phone: '',
		address: '',
		email: '',
		payment: null,
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	getCatalog(): IProduct[] {
		return this.catalog;
	}

	setCatalog(catalog: IProduct[]) {
		this.catalog = catalog;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getTotalPrice(): number {
		const total = this.basket.reduce((sum, item) => sum + item.price, 0);
		return total;
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		if (field === 'payment') {
			if (value === 'card' || value === 'cash') {
				this.order[field] = value;
			}
		} else {
			this.order[field] = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	addToBasket(product: IProduct) {
		const alreadyInBasket = this.basket.some((item) => item.id === product.id);

		if (alreadyInBasket) {
			this.events.emit('basket:open');
		} else {
			this.basket.push(product);
			const total = this.getTotalPrice();
			this.events.emit('basket:totalChanged', {
				totalPrice: total,
				unit: 'синапсов',
			});
		}
	}
}
