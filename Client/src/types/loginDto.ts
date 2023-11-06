import {RegisterDto} from "./registerDto.ts";

export type LoginDto = Omit<RegisterDto, "email">
