import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
