import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { messageTemplateValidationSchema } from 'validationSchema/message-templates';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMessageTemplates();
    case 'POST':
      return createMessageTemplate();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMessageTemplates() {
    const data = await prisma.message_template
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'message_template'));
    return res.status(200).json(data);
  }

  async function createMessageTemplate() {
    await messageTemplateValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.message?.length > 0) {
      const create_message = body.message;
      body.message = {
        create: create_message,
      };
    } else {
      delete body.message;
    }
    const data = await prisma.message_template.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
