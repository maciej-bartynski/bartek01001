FROM node:22.20.0-alpine
RUN npm install -g npm@11.6.1
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
