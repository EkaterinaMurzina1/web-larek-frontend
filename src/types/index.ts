export interface IProduct {
	id: string;
	title: string;
	description?: string;
	image?: string;
	price: number | null;
	category?: string;
}

export interface ICard extends IProduct {
	button: string;
	inBasket?: boolean;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}
export interface IOrderForm {
	payment: PaymentMethods;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export type PaymentMethods = 'card' | 'cash';


export interface IOrder {
	items: string[];
	total: number;
	email: string;
	phone: string;
	payment: PaymentMethods;
	address: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IModalData {
	content: HTMLElement;
}

export interface ISuccessOrder {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface IPage {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}
