export class CommonMessageResposeDto {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;

  constructor(id: string, content: string, createdAt: Date, senderId: string) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.senderId = senderId;
  }
}
