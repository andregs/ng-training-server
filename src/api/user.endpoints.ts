import { Express, Request, Response } from 'express';
import { Serialize, Deserialize } from 'cerialize';
import { User } from '../model';

let id = 0;

let data = [
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
    })
    .post((req: Request, res: Response) => {
      const newUser = Deserialize(req.body, User) as User;
      const found = data.find(user => user.id === newUser.id);
      if (found) {
        res.sendStatus(409);
      } else {
        newUser.id = ++id;
        data.push(newUser);
        res.setHeader('Location', `${req.url}/${id}`);
        res.sendStatus(201); // created
        console.log('Created:', JSON.stringify(newUser, null, 2));
      }
    });

  express.route(`${base}/:id`)
    .get((req: Request, res: Response) => {
      const record = data.find(r => r.id === + req.params.id);
      if (record) {
        const result = Serialize(record);
        res.send(result);
        console.log('Found:', JSON.stringify(result, null, 2));
      } else {
        res.sendStatus(404);
      }
    })
    .delete((req: Request, res: Response) => {
      const result = data.filter(r => r.id !== + req.params.id);
      if (result.length < data.length) {
        data = result;
        res.sendStatus(204);
        console.log('Deleted:', JSON.stringify(result, null, 2));
      } else {
        res.sendStatus(404);
      }
    })
    .put((req: Request, res: Response) => {
      const updated = Deserialize(req.body, User) as User;
      const existing = data.find(u => u.id === updated.id);
      if (! existing) {
        res.sendStatus(404);
      } else {
        Object.assign(existing, updated);
        res.sendStatus(204);
        console.log('Updated:', JSON.stringify(updated, null, 2));
      }
    });
}

export function login(user: User) {
  data.forEach(u => u.authenticated = u.id === user.id);
}

export function logout() {
  data.forEach(u => u.authenticated = false);
}

export function authenticated() {
  return data.find(u => u.authenticated);
}
