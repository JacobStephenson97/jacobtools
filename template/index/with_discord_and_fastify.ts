import Fastify from "fastify";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { env } from './env/schema.js';
import { Client, Events, GatewayIntentBits } from 'discord.js';

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


console.log("If you need to add your bot to a server, use this link:");
console.log(`https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&permissions=8&scope=bot`);



const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once(Events.ClientReady, () => {
  console.log("Ready!");
}
);


client.login(env.DISCORD_TOKEN);

