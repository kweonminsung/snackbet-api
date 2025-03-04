export class AccountResposeDto {
  id: string;
  walletAddress: string;

  constructor(id: string, walletAddress: string) {
    this.id = id;
    this.walletAddress = walletAddress;
  }
}
