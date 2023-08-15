import fs from 'fs/promises';
import path from 'path';

const databaseFile = path.join(process.cwd(), 'database.json');

const readDatabase = async () => {
  const database = await fs.readFile(databaseFile, 'utf-8');
  return JSON.parse(database);
};

export const getHabits = async () => {
  const database = await readDatabase();
  return database.habits;
};

export const getTodayHabits = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const database = await readDatabase();

  return database.habits.map((habit) => {
    return {
      ...habit,
      done: habit.daysDone[today] || false,
    };
  });
};

export const addHabit = async (title) => {
  const habits = await getHabits();

  habits.push({
    id: habits[habits.length - 1].id + 1,
    title,
    daysDone: {},
  });

  await fs.writeFile(databaseFile, JSON.stringify({ habits }, null, 2));
};

export const updateHabit = async (habitId, done) => {
  const today = new Date().toISOString().slice(0, 10);
  const habits = await getHabits();

  const habitIndex = habits.findIndex((habit) => habit.id === Number(habitId));
  if (habitIndex === -1) {
    throw new Error('Habit not found');
  }

  habits[habitIndex].daysDone[today] = done;

  await fs.writeFile(databaseFile, JSON.stringify({ habits }, null, 2));
};
