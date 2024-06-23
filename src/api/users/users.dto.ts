import {
  IsBooleanString,
  IsEmail,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ListUserDto {
  @IsNumberString()
  @ValidateIf((object, value) => value !== undefined)
  skip: string;

  @IsNumberString()
  @ValidateIf((object, value) => value !== undefined)
  take: string;

  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  email: string;

  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  name: string;

  @IsBooleanString()
  @ValidateIf((object, value) => value !== undefined)
  active: string;
}

export class FindUserDto {
  @IsString()
  @ValidateIf((object, value) => object.email === undefined || value)
  id: string;

  @IsEmail()
  @ValidateIf((object, value) => object.id === undefined || value)
  email: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @ValidateIf((object, value) => object.email === undefined || value)
  name: string;

  @IsEmail()
  @ValidateIf((object, value) => object.name === undefined || value)
  email: string;
}
