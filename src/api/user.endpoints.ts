import { Express, Request, Response } from 'express';
import { Serialize } from 'cerialize';
import { User } from '../model';

let id = 0;

const data = [
  new User({
    id: ++id,
    email: 'stanley@example.com',
    firstName: 'Stanley',
    lastName: 'Ipkiss',
    birthdate: new Date(1980, 0, 1),
    admin: true,
  }),
  new User({
    id: ++id,
    email: 'kevin@example.com',
    firstName: 'Kevin',
    lastName: 'McCallister',
    birthdate: new Date(1995, 11, 25),
    admin: false,
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