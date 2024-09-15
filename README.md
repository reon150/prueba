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
