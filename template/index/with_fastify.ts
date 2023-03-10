import Fastify from "fastify";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { env } from './env/schema.js';

const fastify = Fastify();

fastify.get("/", async (request, reply) => {
  return { hello: "Fastify!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3030 });
    console.log("Fastify App listening on port 3030!");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();

