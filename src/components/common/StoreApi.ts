import { Api, ApiListResponse } from '../base/api';
import { IOrderForm, IOrderResult, IProduct } from '../../types';

export interface IStoreApi {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrderForm) => Promise<IOrderResult>;
}

export class StoreAPI extends Api implements IStoreApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	async getProductItem(id: string): Promise<IProduct> {
		try {
			const item = (await this.get(`/product/${id}`)) as IProduct;
			return {
				...item,
				image: this.cdn + item.image,
			};
		} catch (error) {
			console.error(`Ошибка загрузки товара ${id}:`, error);
			throw error;
		}
	}

	async orderProducts(order: IOrderForm): Promise<IOrderResult> {
		try {
			const data = (await this.post('/order', order)) as IOrderResult;
			if (!data.id) {
				throw new Error('Ошибка данных сервера');
			}
			return data;
		} catch (error) {
			console.error('Не удалось оформить заказ', error);
			throw error;
		}
	}
}
