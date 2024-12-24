FROM node:22.8.0-alpine3.20

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

# RUN addgroup app && adduser -S -G app app
# RUN chown -R app:app /app
# USER app

EXPOSE 3001

CMD [ "npm", "start" ]