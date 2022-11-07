import { Response, Request, NextFunction } from 'express';

export const selfOnly = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.path);
  console.log(res.statusCode);
  console.log('nice');
  next();
};
