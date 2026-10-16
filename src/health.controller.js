import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('salud')
@Controller('health')
export class HealthController {
  @Get()
  estado() {
    return { estado: 'ok', fecha: new Date().toISOString() };
  }
}
