export class Message {
  id?: string; // message ID
  replyMessage?: string; // reply messages
  forwarded?: boolean = false; // message has been forwarded to team
  forwardedTo?: string[]; // message forwarded targets
  createdAt: string = new Date().toISOString();
  updatedAt: string = new Date().toISOString();
  name: string;
  email: string;
  messages: string;

  constructor(m: Message) {
    this.createdAt = m.createdAt;
    this.updatedAt = m.updatedAt;
    this.name = m.name;
    this.email = m.email;
    this.messages = m.messages;
    Object.assign(this, m);
  }
}
