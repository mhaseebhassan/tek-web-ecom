FROM node:18

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN npm install

COPY . .

RUN npx prisma generate

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN NEXT_PUBLIC_SKIP_DB=true npm run build
EXPOSE 3000

CMD ["npm", "start"]