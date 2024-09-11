import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { PaginationResponseDto } from '../dto';

export function ApiPaginatedResponse<T>(model: new (...args: any[]) => T) {
  return applyDecorators(
    ApiExtraModels(PaginationResponseDto, model),
    ApiResponse({
      status: 200,
      description: 'A paginated response of the list.',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}
