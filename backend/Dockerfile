FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 15000
CMD ["npm", "start"]
