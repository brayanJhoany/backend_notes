import { Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  itemPerPage: number;

  @Type(() => Number)
  @IsPositive()
  @Min(1)
  currentPage: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  keyword: string;
}
