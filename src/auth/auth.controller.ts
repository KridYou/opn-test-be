import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-auth.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../common/jwt/jwt.auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from '../common/jwt/jwt-payload.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.authService.findUserById(id);
  }

  @Put('user/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('user/delete')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    console.log('controller: userId', user)
    const userId = user.userId
    await this.authService.deleteAccount(userId);
  }
}
