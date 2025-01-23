FROM node:22.8.0-alpine3.20
WORKDIR /app
COPY package*.json .
RUN npm install --production

COPY . .

RUN addgroup app_group && adduser -G app_group -S app_user
RUN chown -R app_user:app_group /app
USER app_user

EXPOSE 3001
CMD [ "npm", "start" ]