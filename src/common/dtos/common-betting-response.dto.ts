import { CommonOptionResponseDto } from './common-option-response.dto';

export class CommonBettingResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  isEnded: boolean;
  endDate?: Date;
  isSettled: boolean;
  options: CommonOptionResponseDto[];

  constructor(
    id: string,
    name: string,
    description: string | null,
    createdAt: Date,
    isEnded: boolean,
    endDate: Date | null,
    isSettled: boolean,
    options: CommonOptionResponseDto[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.isEnded = isEnded;
    this.endDate = endDate;
    this.isSettled = isSettled;
    this.options = options;
  }
}
