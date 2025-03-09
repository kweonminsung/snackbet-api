import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum GetChatMessagesSortByOptions {
  DEFAULT = 'DEFAULT',
  WRITE_DATE = 'WRITE_DATE',
}

export enum GetChatMessagesOrderByOptions {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetChatMessagesQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastMessageId?: string; // 커서 기반 페이징을 위한 마지막 메시지 ID

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20; // 한 번에 불러올 메시지 개수

  @ApiProperty({ enum: GetChatMessagesSortByOptions, required: false })
  @IsOptional()
  @IsEnum(GetChatMessagesSortByOptions)
  sortBy?: GetChatMessagesSortByOptions = GetChatMessagesSortByOptions.DEFAULT;

  @ApiProperty({ enum: GetChatMessagesOrderByOptions, required: false })
  @IsOptional()
  @IsEnum(GetChatMessagesOrderByOptions)
  orderBy?: GetChatMessagesOrderByOptions = GetChatMessagesOrderByOptions.DESC;
}
