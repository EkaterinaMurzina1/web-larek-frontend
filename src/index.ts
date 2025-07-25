import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, PaymentMethods, IOrderResult, IOrder } from './types';

import { EventEmitter } from './components/base/events';

import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';

import { AppState } from './components/common/AppState';
import { Card } from './components/common/Card';
import { Order } from './components/common/Order';
import { Page } from './components/common/Page';
import { StoreAPI } from './components/common/StoreApi';

const events = new EventEmitter();
const api = new StoreAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);

//  Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Компоненты
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

// Получение данных с сервера
api
	.getProductList()
	.then((products) => {
		appData.setCatalog(products);
	})
	.catch((err) => {
		console.error(err);
	});

// Обновление каталога
events.on('items:changed', () => {
	page.catalog = appData.getCatalog().map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			inBasket: appData.basket.some((basketItem) => basketItem.id === item.id),
		});
	});
});

// Открытие карточки товара
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Превью товара
events.on('preview:changed', (item: IProduct) => {
	const preview = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (appData.basket.some((basketItem) => basketItem.id === item.id)) {
				events.emit('basket:open');
			} else {
				events.emit('basket:add', item);
			}
		},
	});

	modal.render({
		content: preview.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
			inBasket: appData.basket.some((basketItem) => basketItem.id === item.id),
		}),
	});
});

// Добавление в корзину
events.on('basket:add', (item: IProduct) => {
	appData.addToBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	const basketItems = appData.basket.map((item) => {
		const basketItem = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', item),
		});
		return basketItem.render({
			id: item.id,
			title: item.title,
			price: item.price,
		});
	});

	basket.items = basketItems;
	basket.total = appData.getTotalPrice();
	basket.isButtonDisabled = appData.basket.length === 0;
	basket.updateIndex();

	modal.render({
		content: basket.render({}),
	});
});

// Удаление товара из корзины
events.on('basket:remove', (item: IProduct) => {
	appData.basket = appData.basket.filter(
		(basketItem) => basketItem.id !== item.id
	);
	page.counter = appData.basket.length;
	events.emit('basket:open');
	basket.updateIndex();
});

// Открытие формы заказа
events.on('order:open', () => {
	if (appData.basket.length === 0) return;

	appData.order.items = appData.basket.map((item) => item.id);
	appData.order.total = appData.getTotalPrice();

	modal.render({
		content: order.render({
			valid: false,
			errors: [],
			address: appData.order.address,
			payment: appData.order.payment,
		}),
	});
});

// изменение способа оплаты
events.on('payment:change', (data: { name: PaymentMethods }) => {
	appData.setOrderField('payment', data.name);
	order.valid = appData.validateOrder();
});

// Изменение адреса
events.on('order.address:change', (data: { value: string }) => {
	appData.setOrderField('address', data.value);
	order.valid = appData.validateOrder();
});

// Обработка отправки формы заказа
events.on('order:submit', () => {
	if (appData.validateOrder()) {
		modal.render({
			content: contacts.render({
				valid: false,
				errors: [],
				email: appData.order.email,
				phone: appData.order.phone,
			}),
		});
	}
});

//Изменение почты
events.on('contacts.email:change', (data: { value: string }) => {
	appData.setContactsField('email', data.value);
	contacts.valid = appData.validateContacts();
});

// Изменение телефона
events.on('contacts.phone:change', (data: { value: string }) => {
	appData.setContactsField('phone', data.value);
	contacts.valid = appData.validateContacts();
});
// Изменение полей формы контактов
events.on('contacts:submit', () => {
	if (appData.validateContacts()) {
		api
			.orderProducts(appData.order)
			.then((result: IOrderResult) => {
				const success = new Success(
					cloneTemplate(successTemplate),
					{
						onClick: () => {
							modal.close();
							appData.resetBasket();
							appData.resetOrder();
							page.counter = 0;
							basket.updateIndex();
						},
					},
					result.total
				);

				modal.render({
					content: success.render({}),
				});
			})
			.catch((err) => {
				console.error(err);
			});
	}
});

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокировка прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
	appData.resetOrder();
});

// Обработка ошибок формы
events.on(
	'formErrors:change',
	(errors: Partial<Record<keyof IOrder, string>>) => {
		const { payment, address, email, phone } = errors;
		order.errors = [payment, address].filter(Boolean).join('; ');
		contacts.errors = [email, phone].filter(Boolean).join('; ');
	}
);

events.on('form:reset', () => {
	appData.resetOrder();
	order.render({
		valid: false,
		errors: [],
		address: '',
		payment: null,
	});
	contacts.render({
		valid: false,
		errors: [],
		email: '',
		phone: '',
	});
});
