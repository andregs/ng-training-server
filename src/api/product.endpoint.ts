import { Express, Request, Response, Router } from 'express';
import { Serialize, Deserialize } from 'cerialize';
import { Category, Product } from '../model';

let categoryId = 0;
let productId = 0;

let data = [
  new Category({
    id: ++categoryId,
    name: 'Games',
    products: [
      new Product({
        categoryId,
        id: ++productId,
        name: 'Red Dead Redemption',
        color: 'red',
        price: 25.5,
      }),
      new Product({
        categoryId,
        id: ++productId,
        name: 'Machinarium',
        color: 'brown',
        price: 12.25,
      }),
    ],
  }),
  new Category({
    id: ++categoryId,
    name: 'Books',
    products: [
      new Product({
        categoryId,
        id: ++productId,
        name: 'Neuromancer',
        color: 'blue',
        price: 17.43,
      }),
      new Product({
        categoryId,
        id: ++productId,
        name: 'What If?',
        color: 'limegreen',
        price: 14,
      }),
    ],
  }),
];

export function productEndpoints(express: Express): void {
  const categoryBaseUrl = '/api/categories';
  const productBaseUrl = '/:categoryId/products';

  const categoryRouter = Router();
  const productRouter = Router({ mergeParams: true });

  categoryRouter.use(productBaseUrl, productRouter);

  categoryRouter.route('/')
    .get((_, res: Response) => {
      const filtered = data.map(c => ({ id: c.id, name: c.name }));
      const result = Serialize(filtered, Category);
      res.send(result);
    })
    .post((req: Request, res: Response) => {
      const newRecord = Deserialize(req.body, Category) as Category;
      const found = data.find(record => record.id === newRecord.id);
      if (found) {
        res.sendStatus(409);
      } else {
        newRecord.id = ++categoryId;
        data.push(newRecord);
        res.setHeader('Location', `${req.url}/${categoryId}`);
        res.sendStatus(201); // created
        console.log('Created:', JSON.stringify(newRecord, null, 2));
      }
    });

  categoryRouter.route('/:categoryId')
    .get((req: Request, res: Response) => {
      const record = data.find(r => r.id === + req.params.categoryId);
      if (record) {
        const result = Serialize(record);
        res.send(result);
        console.log('Found:', JSON.stringify(result, null, 2));
      } else {
        res.sendStatus(404);
      }
    })
    .delete((req: Request, res: Response) => {
      const result = data.filter(r => r.id !== + req.params.categoryId);
      if (result.length < data.length) {
        data = result;
        res.sendStatus(204);
        console.log('Deleted:', JSON.stringify(result, null, 2));
      } else {
        res.sendStatus(404);
      }
    })
    .put((req: Request, res: Response) => {
      const updated = Deserialize(req.body, Category) as Category;
      const existing = data.find(u => u.id === updated.id);
      if (!existing) {
        res.sendStatus(404);
      } else {
        Object.assign(existing, updated);
        res.sendStatus(204);
        console.log('Updated:', JSON.stringify(updated, null, 2));
      }
    });

  productRouter.route('/')
    .get((req: Request, res: Response) => {
      const category = data.find(c => c.id === + req.params.categoryId);
      if (! category) return res.sendStatus(404);
      const result = Serialize(category.products, Product);
      res.send(result);
    })
    .post((req: Request, res: Response) => {
      const newRecord = Deserialize(req.body, Product) as Product;
      const category = data.find(c => c.id === + req.params.categoryId);
      if (!category) return res.sendStatus(404);
      const found = category.products.find(record => record.id === newRecord.id);
      if (found) {
        res.sendStatus(409);
      } else {
        newRecord.id = ++productId;
        category.products.push(newRecord);
        res.setHeader('Location', `${req.url}/${productId}`);
        res.sendStatus(201); // created
        console.log('Created:', JSON.stringify(newRecord, null, 2));
      }
    });

  express.use(categoryBaseUrl, categoryRouter);
}
