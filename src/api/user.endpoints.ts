import { Express, Request, Response } from 'express';
import { Serialize } from 'cerialize';
import { User } from '../model';

let id = 0;

const data = [
  new User({
    id: ++id,
    email: 'admin@example.com',
    firstName: 'Joe',
    lastName: 'Admin',
    birthdate: new Date(1990, 0, 1),
    admin: true
  }),
];

export function userEndpoints(express: Express): void {
  const base = '/api/users';

  express.route(`${base}`)
    .get((_, res: Response) => {
      const result = Serialize(data);
      res.send(result);
    });

  express.route(`${base}/:id`)
    .get((req: Request, res: Response) => {
      const record = data.filter(r => r.id === + req.params.id)[0];
      if (record) {
        const result = Serialize(record);
        res.send(result);
      } else {
        res.sendStatus(404);
      }
    });

}