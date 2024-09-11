import { ApiResponse } from '@nestjs/swagger';

export function ApiBadRequestResponse(): MethodDecorator {
  return ApiResponse({
    status: 400,
    description: 'Bad request, invalid query parameters.',
    schema: {
      example: {
        message: [
          'Invalid input parameters.',
          'Ensure all required fields are provided and valid.',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  });
}
