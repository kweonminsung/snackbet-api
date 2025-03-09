export class CommonChatResposeDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageAt?: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    createdAt: Date,
    lastMessage: string | null,
    lastMessageAt: Date | null,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.lastMessage = lastMessage;
    this.lastMessageAt = lastMessageAt;
  }
}
