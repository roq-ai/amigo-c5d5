import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { messageValidationSchema } from 'validationSchema/messages';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.message
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMessageById();
    case 'PUT':
      return updateMessageById();
    case 'DELETE':
      return deleteMessageById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMessageById() {
    const data = await prisma.message.findFirst(convertQueryToPrismaUtil(req.query, 'message'));
    return res.status(200).json(data);
  }

  async function updateMessageById() {
    await messageValidationSchema.validate(req.body);
    const data = await prisma.message.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMessageById() {
    const data = await prisma.message.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
