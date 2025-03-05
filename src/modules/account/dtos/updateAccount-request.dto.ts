import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
}
