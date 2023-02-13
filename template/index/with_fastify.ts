import Fastify from "fastify";

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
