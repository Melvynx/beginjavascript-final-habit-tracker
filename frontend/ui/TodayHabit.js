import { getTodayHabits, updateHabitDone } from '../api/habits-api';
import { HabitSquare } from './HabitSqure';

export class TodayHabits {
  static instance = new TodayHabits();
  constructor() {
    if (TodayHabits.instance) {
      return TodayHabits.instance;
    }
  }

  async init() {
    this.element = document.querySelector('#today-habits');
    this.refresh();
  }

  async refresh() {
    await this.setTodayHabits();
    this.render();
  }

  async toggleDone(habitSquare) {
    try {
      await updateHabitDone(habitSquare.id, !habitSquare.isDone);

      this.refresh();
    } catch {
      alert('Failed to update habit');
    }
  }

  render() {
    const habitsSquare = this.todayHabits.map((habit) => {
      const habitSquare = new HabitSquare(habit.id, habit.title, habit.done, () => {
        this.toggleDone(habitSquare);
      });

      return habitSquare;
    });

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
