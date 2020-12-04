import { Catch } from "@nestjs/common";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @Matches(
    /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,20})/,
    { message: 'Ensure that password is 8 to 64 characters long and contains a mix of upper and lower case characters, one numeric and one special character' }
  )
  password: string;
}