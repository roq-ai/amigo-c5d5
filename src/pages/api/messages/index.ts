import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { messageValidationSchema } from 'validationSchema/messages';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMessages();
    case 'POST':
      return createMessage();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMessages() {
    const data = await prisma.message
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'message'));
    return res.status(200).json(data);
  }

  async function createMessage() {
    await messageValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.message.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
