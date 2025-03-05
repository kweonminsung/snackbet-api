import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum GetChatMessagesSortByOptions {
  DEFAULT = 'DEFAULT',
  WRITE_DATE = 'WRITE_DATE',
}

export enum GetChatMessagesOrderByOptions {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetChatMessagesQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  lastMessageId?: string; // 커서 기반 페이징을 위한 마지막 메시지 ID

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20; // 한 번에 불러올 메시지 개수

  @ApiProperty({ enum: GetChatMessagesSortByOptions })
  @IsOptional()
  @IsEnum(GetChatMessagesSortByOptions)
  sortBy?: GetChatMessagesSortByOptions = GetChatMessagesSortByOptions.DEFAULT;

  @ApiProperty({ enum: GetChatMessagesOrderByOptions })
  @IsOptional()
  @IsEnum(GetChatMessagesSortByOptions)
  orderBy?: GetChatMessagesOrderByOptions = GetChatMessagesOrderByOptions.DESC;
}
