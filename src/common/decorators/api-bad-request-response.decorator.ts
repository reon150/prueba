import { ApiResponse } from '@nestjs/swagger';

export function ApiBadRequestResponse(): MethodDecorator {
  return ApiResponse({
    status: 400,
    description: 'Bad request, invalid query parameters.',
    schema: {
      example: {
        message: [
          'sortBy must be one of the following values: id, name, licenseNumber, email, phoneNumber, createdAt',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  });
}
