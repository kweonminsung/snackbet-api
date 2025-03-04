export class CommonAccountResposeDto {
  id: string;
  walletAddress: string;

  constructor(id: string, walletAddress: string) {
    this.id = id;
    this.walletAddress = walletAddress;
  }
}
