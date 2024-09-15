# Taxi24

A continuación, se describen métodos de ejecución.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org) (versión 18 o superior)
- [Docker](https://www.docker.com) y [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org) (opcional si deseas ejecutar el proyecto localmente sin Docker)

## Variables de Entorno

Asegúrate de tener un archivo `.env` con las siguientes variables de entorno. Puedes utilizar el archivo `.env.example` como base.

## Ejecutar con Docker

Para ejecutar el proyecto utilizando Docker, sigue los siguientes pasos:

1. **Clonar el repositorio**:

```bash
git clone https://github.com/tu-usuario/taxi24.git
cd taxi24
```

2. **Configurar las variables de entorno**:

   Asegúrate de tener un archivo `.env` con los valores correctos de configuración. Puedes copiar el archivo `.env.example` y modificarlo según sea necesario:

```bash
 cp .env.example .env
```

3. **Construir y ejecutar los contenedores**:

   Ejecuta el siguiente comando para levantar la aplicación junto con la base de datos PostgreSQL utilizando Docker Compose:

```bash
 docker-compose up --build
```

4. **Acceder a la aplicación**:

   Una vez que los contenedores estén en ejecución, puedes acceder a la aplicación desde tu navegador web en la siguiente URL:

   http://localhost:3000

   **Nota**: Si cambiaste el puerto en el archivo `.env`, usa el puerto correspondiente.

5. **Comandos adicionales**:

   - Para detener los contenedores:

   ```bash
    docker-compose down
   ```

   - Para ver los logs de la aplicación:

   ```bash
    docker-compose logs -f
   ```

## Ejecutar de forma local (sin Docker)

Si prefieres ejecutar el proyecto de forma local sin Docker, sigue estos pasos:

1. **Clonar el repositorio**:

```bash
 git clone https://github.com/tu-usuario/taxi24.git
 cd taxi24
```

2. **Configurar las variables de entorno**:

   Asegúrate de tener un archivo `.env` con los valores correctos de configuración. Puedes copiar el archivo `.env.example` y modificarlo según sea necesario:

```bash
 cp .env.example .env
```

3. **Instalar dependencias**:

   Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
 npm install
```

4. **Configurar la base de datos**:

   - Asegúrate de tener PostgreSQL instalado y en ejecución.
   - Crea una base de datos con el nombre especificado en el archivo `.env` (`DB_NAME`).
   - Asegúrate de que los detalles de conexión (`DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_PORT`) sean correctos.

5. **Ejecutar las migraciones**:

   Ejecuta las migraciones de la base de datos con el siguiente comando:

```bash
 npm run migration:run
```

6. **Sembrar datos (opcional)**:

   Si estás en el entorno de desarrollo y deseas sembrar datos de prueba, puedes ejecutar el siguiente comando:

```bash
 npm run seed:run
```

7. **Iniciar la aplicación**:

   Finalmente, inicia la aplicación utilizando el siguiente comando:

```bash
 npm run start:dev
```

La aplicación estará disponible en:

http://localhost:3000

## Ejecutar los Tests

Este proyecto incluye una suite de tests para asegurar la funcionalidad del código. Los tests están escritos utilizando [Jest](https://jestjs.io/).

### Comandos disponibles para los tests:

- **Ejecutar todos los tests**:

  Utiliza el siguiente comando para ejecutar todos los tests:

  ```bash
  npm run test
  ```

- **Ejecutar tests en modo de observación**:

  Si deseas ejecutar los tests continuamente cada vez que se realicen cambios en los archivos, utiliza el siguiente comando:

  ```bash
  npm run test:watch
  ```

- **Ver el informe de cobertura**:

  Para generar un informe de cobertura de los tests, utiliza el siguiente comando:

  ```bash
  npm run test:cov
  ```

- **Depurar tests**:

  Si necesitas depurar los tests, puedes hacerlo utilizando el siguiente comando, que abrirá un puerto para que puedas conectar un depurador:

  ```bash
  npm run test:debug
  ```

### Reporte de Cobertura

Después de ejecutar los tests con el comando de cobertura (`npm run test:cov`), se generará un reporte detallado que puedes encontrar en la carpeta `coverage/`.

## Uso de la API

La API de Taxi24 proporciona múltiples endpoints para gestionar conductores, viajes y pasajeros. A continuación se describen algunos casos de uso comunes para los consumidores de la API, implementados de manera RESTful.

### Conductores

1. **Obtener una lista de todos los conductores**:

   - **Endpoint**: `GET /api/drivers`
   - **Descripción**: Devuelve una lista paginada de todos los conductores.
   - **Parámetros opcionales**:
     - `page`: Número de página (por defecto: 1)
     - `limit`: Límite de elementos por página (por defecto: 10)
     - `isAvailable`: Filtrar por disponibilidad (boolean)
     - `sortBy`: Campo por el cual ordenar (ejemplo: `name`, `email`)
     - `sortOrder`: Orden de la lista (`ASC`, `DESC`)

2. **Obtener una lista de todos los conductores disponibles**:

   - **Endpoint**: `GET /api/drivers?isAvailable=true`
   - **Descripción**: Devuelve una lista de conductores disponibles.

3. **Obtener una lista de todos los conductores disponibles en un radio de 3 km para una ubicación específica**:

   - **Endpoint**: `GET /api/drivers/nearby`
   - **Descripción**: Devuelve una lista de conductores cercanos a una ubicación.
   - **Parámetros requeridos**:
     - `latitude`: Latitud de la ubicación.
     - `longitude`: Longitud de la ubicación.
     - `radius`: Radio de búsqueda en kilómetros (ejemplo: `3`).

4. **Obtener un conductor específico por ID**:
   - **Endpoint**: `GET /api/drivers/{id}`
   - **Descripción**: Devuelve información detallada de un conductor específico por su ID.

### Viajes

1. **Crear una nueva solicitud de viaje asignando un conductor a un pasajero**:

   - **Endpoint**: `POST /api/trips`
   - **Descripción**: Crea un nuevo viaje asignando un conductor y un pasajero.
   - **Cuerpo de la solicitud (JSON)**:
     ```json
     {
       "driverId": "uuid-del-conductor",
       "passengerId": "uuid-del-pasajero",
       "startLatitude": 40.712776,
       "startLongitude": -74.005974,
       "startTime": "2024-09-13T08:45:00Z"
     }
     ```

2. **Completar un viaje**:

   - **Endpoint**: `PATCH /api/trips/{id}`
   - **Descripción**: Actualiza el estado de un viaje a "completado" proporcionando la ubicación de destino y el tiempo de finalización.
   - **Cuerpo de la solicitud (JSON)**:
     ```json
     {
       "status": "Completed",
       "endLatitude": 40.73061,
       "endLongitude": -73.935242,
       "endTime": "2024-09-13T09:15:00Z"
     }
     ```

3. **Obtener una lista de todos los viajes activos**:
   - **Endpoint**: `GET /api/trips?status=Active`
   - **Descripción**: Devuelve una lista de todos los viajes activos.

### Pasajeros

1. **Obtener una lista de todos los pasajeros**:

   - **Endpoint**: `GET /api/passengers`
   - **Descripción**: Devuelve una lista paginada de todos los pasajeros.

2. **Obtener un pasajero específico por su ID**:

   - **Endpoint**: `GET /api/passengers/{id}`
   - **Descripción**: Devuelve información detallada de un pasajero específico por su ID.

3. **Para un pasajero solicitando un viaje, obtener una lista de los 3 conductores más cercanos al punto de partida**:
   - **Endpoint**: `GET /api/drivers/nearby`
   - **Descripción**: Devuelve los 3 conductores más cercanos a la ubicación de partida del pasajero.
   - **Parámetros requeridos**:
     - `latitude`: Latitud de la ubicación del pasajero.
     - `longitude`: Longitud de la ubicación del pasajero.
     - `count`: Número de conductores a devolver (ejemplo: `3`).

### Ejemplo de Respuesta

Un ejemplo de respuesta JSON para la lista de conductores:

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "licenseNumber": "LIC1234567",
      "email": "johndoe@example.com",
      "phoneNumber": "+18095551234",
      "isAvailable": true,
      "locationLatitude": 37.7749,
      "locationLongitude": -122.4194,
      "createdAt": "2023-09-10T12:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalPages": 10
  }
}
```

Se puede acceder a la documentación completa de la API generada con Swagger en la siguiente URL:

[http://localhost:3000/api/docs](http://localhost:3000/api/docs)
