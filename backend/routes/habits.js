import {
  addHabit,
  getHabits,
  getTodayHabits,
  updateHabit,
} from '../habits.helper.js';

export async function habitsRoute(fastify) {
  fastify.get('/', async () => {
    const habits = await getHabits();
    return habits;
  });
  fastify.post('/', async (request, reply) => {
    const body = request.body;

    console.log(body);
    if (!body.title) {
      return reply.code(400).send({ error: 'Title is required' });
    }

    await addHabit(body.title);

    return reply.code(201).send({ success: true });
  });

  fastify.get('/today', async () => {
    const todayHabits = await getTodayHabits();

    return todayHabits;
  });

  fastify.patch('/:habitId', async (request, reply) => {
    const body = request.body;

    if (body.done === undefined) {
      return reply.code(400).send({ error: 'Done is required' });
    }

    await updateHabit(request.params.habitId, body.done);

    return reply.code(200).send({ success: true });
  });
}
