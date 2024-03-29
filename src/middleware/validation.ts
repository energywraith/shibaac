import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ObjectShape, OptionalObjectSchema } from 'yup/lib/object';

export function validate(
  schema: OptionalObjectSchema<ObjectShape>,
  handler: NextApiHandler
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (['POST', 'PUT'].includes(req.method as string)) {
      try {
        req.body = await schema
          .camelCase()
          .validate(req.body, { abortEarly: false, stripUnknown: true });
      } catch (error) {
        return res.status(400).json(error);
      }
    }
    await handler(req, res);
  };
}
