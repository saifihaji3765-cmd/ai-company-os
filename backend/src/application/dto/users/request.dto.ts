export interface CreateUserDto {
  readonly name: string;
  readonly email: string;
}

export interface UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
}
