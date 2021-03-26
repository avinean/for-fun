import { Message } from '@doer/entities';

export const isPrev = (msg: Message, prevMsg: Message): boolean => {
  if (!prevMsg) return false;
  if (msg.userId !== prevMsg.userId) return false;
  if (!msg.createdAt || !prevMsg.createdAt) return false;
  const current = new Date(msg.createdAt).getTime();
  const prev = new Date(prevMsg.createdAt).getTime();
  return current - prev < 60000;
};
