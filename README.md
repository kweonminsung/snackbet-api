# Snackbet API

API for [Snackbet](https://github.com/snackbet)(create easy betting in chat using web3)<br>
[Solana Bootcamp 2025: Korea Hackathon](https://earn.superteam.fun/listing/solana-bootcamp-2025-korea-hackathon/) entry

### Dependencies

- [Node.js](https://nodejs.org/) 22.x or higher
- [NestJS](https://nestjs.com/) 11.x or higher
- MySQL 8.0
- SQLite

### Setup Dev Environment

```bash
# Install NPM packages
npm install

# Create env file
echo -e "
APP_ENV=development
APP_PORT=8000
DB_URL=\"file:./../dev.db\"
" > .env

# Create DB(SQLite) & sync schema
npx prisma db push --schema prisma/sqlite.schema.prisma

# Run server
npm run start:dev
```

### Deployment

```bash
# Install NPM packages
npm install

# Create env file
echo -e "
APP_ENV=production
APP_PORT={APP_PORT}
DB_URL={DB_URL}
" > .env

# Run server
npm run start
```
