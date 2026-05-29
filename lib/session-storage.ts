import {Session} from '@shopify/shopify-api';

const sessions = new Map<string, Session>();

export const sessionStorage = {
  async storeSession(session: Session): Promise<boolean> {
    sessions.set(session.id, session);
    return true;
  },

  async loadSession(id: string): Promise<Session | undefined> {
    return sessions.get(id);
  },

  async deleteSession(id: string): Promise<boolean> {
    return sessions.delete(id);
  },
};
