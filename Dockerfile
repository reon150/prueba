FROM node:22.8.0-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["sh", "-c", "echo Running migrations... && npm run migration:run && echo Checking environment... && ( [ \"$APP_ENV\" = 'development' ] && echo Seeding data... && npm run seed:run || echo Skipping seeding... ) && echo Starting application... && node dist/src/main"]
