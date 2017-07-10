import { Express, Request, Response } from 'express';
import { Deserialize, Serialize } from 'cerialize';
import { User } from '../model';
import { login, logout, authenticated } from './user.endpoints';

export function authEndpoints(express: Express): void {

  express.route(`/api/login`)
    .post((req: Request, res: Response) => {
      const user = Deserialize(req.body, User);
      login(user);
      console.log('Authenticated:', user);
      res.sendStatus(204);
    });

  express.route(`/api/logout`)
    .get((_, res: Response) => {
      logout();
      console.log('Bye!');
      res.sendStatus(204);
    });

  express.route(`/api/authenticated`)
    .get((_, res: Response) => {
      const user = authenticated();
      if (user) {
        res.send(Serialize(user));
      } else {
        res.sendStatus(401);
      }
    });

}
