export class CommonBettingResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  isEnded: boolean;
  endDate?: Date;
  isSettled: boolean;

  constructor(
    id: string,
    name: string,
    description: string | null,
    createdAt: Date,
    isEnded: boolean,
    endDate: Date | null,
    isSettled: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.isEnded = isEnded;
    this.endDate = endDate;
    this.isSettled = isSettled;
  }
}
