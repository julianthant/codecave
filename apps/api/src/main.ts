// IMPORTANT: Make sure to import `instrument.ts` at the top of your file.
// If you're using CommonJS (CJS) syntax, use `require("./instrument.ts");`
import "./instrument";

// All other imports below
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth to work correctly
  });

  // Configure CORS for both development and production
  app.enableCors({
    origin: [
      "http://localhost:3000", // Development
      "https://codecave.tech", // Production
      "https://www.codecave.tech", // Production with www
      "https://app.codecave.tech", // Production subdomain
    ],
    credentials: true, // Required for cookies/session
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API Server running on port ${port}`);
}

bootstrap();
