import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserPropsDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsEmail()
  public email: string | null;

  @IsString()
  @IsNotEmpty()
  public firstName: string | null;

  @IsString()
  @IsNotEmpty()
  public lastName: string | null;
}
