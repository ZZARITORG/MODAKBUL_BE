import { IsString } from 'class-validator';

export class UserSearchDto {
  @IsString()
  search: string;
}
