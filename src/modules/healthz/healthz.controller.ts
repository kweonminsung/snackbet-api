import { CommonResponseDto } from './../../common/dtos/common-response.dto';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('healthz')
@Controller('healthz')
export class HealthzController {
  @Get()
  @ApiOperation({ summary: '서버 작동 확인' })
  getHealth() {
    return new CommonResponseDto();
  }
}
