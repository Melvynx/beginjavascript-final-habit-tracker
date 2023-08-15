import { getTodayHabits, updateHabitDone } from '../api/habits-api';
import { HabitSquare } from './HabitSqure';

export class TodayHabits {
  static instance;
  constructor() {
    if (TodayHabits.instance) {
      throw new Error('Use TodayHabits.getInstance()');
    }
  }

  static getInstance() {
    if (!TodayHabits.instance) {
      TodayHabits.instance = new TodayHabits();
    }
    return TodayHabits.instance;
  }

  onToggle = (habitSquare) => {
    this.toggleDone(habitSquare);
  };
  habitsSquare = [];

  async init() {
    this.element = document.querySelector('#today-habits');
    this.refresh();
  }

  async refresh() {
    await this.setTodayHabits();
    this.habitsSquare.forEach((habitSquare) => {
      habitSquare.removeEventListener('toggle', this.onToggle);
      habitSquare.destroy();
    });
    this.habitsSquare = [];
    this.render();
  }

  async toggleDone({ currentTarget }) {
    try {
      await updateHabitDone(currentTarget.id, !currentTarget.isDone);

      this.refresh();
    } catch {
      alert('Failed to update habit');
    }
  }

  render() {
    const habitsSquare = this.todayHabits.map((habit) => {
      const habitSquare = new HabitSquare(habit.id, habit.title, habit.done);
      habitSquare.addEventListener('toggle', this.onToggle);

      return habitSquare;
    });

    this.habitsSquare = habitsSquare;

    // remove all children from the element
    this.element.innerHTML = '';

    // add all children to the element
    habitsSquare.forEach((habitSquare) => {
      this.element.appendChild(habitSquare.element);
    });
  }

  async setTodayHabits() {
    try {
      this.todayHabits = await getTodayHabits();
    } catch {
      alert('Failed to get today habits');
    }
  }
}
