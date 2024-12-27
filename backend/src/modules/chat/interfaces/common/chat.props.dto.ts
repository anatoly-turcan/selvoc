import { IsString, IsNotEmpty } from 'class-validator';

export class ChatPropsDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;
}
