import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-auth.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(body: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = this.userRepository.create({
      ...body,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { accessToken: token };
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const userInfo = await this.userRepository.findOne({ where: { id } });

    if (!userInfo) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    const userResponse = plainToInstance(UserResponseDto, userInfo, {
      excludeExtraneousValues: true,
    });

    return userResponse;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateUserDto);

    const response = await this.userRepository.save(user);

    const userResponse = plainToInstance(UserResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return userResponse;
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(userId)
    await this.userRepository.remove(user);
  }
}
