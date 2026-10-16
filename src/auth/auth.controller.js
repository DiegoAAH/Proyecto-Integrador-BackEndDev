import { Bind, Body, Controller, Dependencies, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { validar } from '../common/pipes/validar';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

@ApiTags('auth')
@Controller('auth')
@Dependencies(AuthService)
export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  @Post('registro')
  @ApiBody({ type: RegistroDto })
  @Bind(Body(validar(RegistroDto)))
  registrar(dto) {
    return this.authService.registrar(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @Bind(Body(validar(LoginDto)))
  login(dto) {
    return this.authService.login(dto);
  }
}
