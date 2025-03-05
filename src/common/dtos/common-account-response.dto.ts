export class CommonAccountResposeDto {
  id: string;
  username: string;
  walletAddress: string;

  constructor(id: string, username: string, walletAddress: string) {
    this.id = id;
    this.username = username;
    this.walletAddress = walletAddress;
  }
}

export class CommonSimpleAccountResposeDto {
  id: string;
  username: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }
}
