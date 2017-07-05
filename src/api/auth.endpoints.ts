import { Express, Request, Response } from 'express';
import { Deserialize } from 'cerialize';
import { User } from '../model';

let authenticated: User | null = null;

export function authEndpoints(express: Express): void {

  express.route(`/api/login`)
    .post((req: Request, res: Response) => {
      const result = Deserialize(req.body, User);
      authenticated = result;
      console.log('Authenticated:', authenticated);
      res.sendStatus(204);
    });

  express.route(`/api/logout`)
    .get((_, res: Response) => {
      authenticated = null;
      console.log('Bye!');
      res.sendStatus(204);
    });

}
