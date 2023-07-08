const mapping: Record<string, string> = {
  contacts: 'contact',
  messages: 'message',
  'message-templates': 'message_template',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
