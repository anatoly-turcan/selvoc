import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Base DTO for Chat entity properties, shared across interface layers
 */
export class ChatPropsDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;
}
