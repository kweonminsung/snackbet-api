import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum GovernanceType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export class CreateOptionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateBettingRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  eventSource?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(GovernanceType)
  governanceType: GovernanceType;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateOptionRequestDto)
  @IsArray()
  options: CreateOptionRequestDto[];
}
