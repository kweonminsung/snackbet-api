import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthAccountRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nonce: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  signature: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  publicKey: string;
}
