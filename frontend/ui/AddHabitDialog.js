import { createHabit } from '../api/habits-api';
import { TodayHabits } from './TodayHabit';

export class AddHabitDialog {
  static instance = new AddHabitDialog();
  constructor() {
    if (AddHabitDialog.instance) {
      return AddHabitDialog.instance;
    }

    this._open = false;
  }

  init() {
    this.trigger = document.querySelector('#add-new-habit');
    this.dialog = document.querySelector('#add-habit-dialog');
    this.form = document.querySelector('#add-habit-form');

    this.trigger.addEventListener('click', () => {
      this.open = true;
    });

    this.form.addEventListener('submit', async (event) => {
      await this.handleSubmit(event);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.form);

    const title = formData.get('title');

    try {
      await createHabit(title);
    } catch {
      alert('Failed to create habit');
    }

    await TodayHabits.instance.refresh();

    this.open = false;
  }

  get open() {
    return this._open;
  }

  set open(value) {
    this._open = value;

    if (value) {
      this.dialog.setAttribute('open', '');
    } else {
      this.dialog.removeAttribute('open');
    }
  }
}
