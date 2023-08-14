import { getAllHabits } from '../api/habits-api';

export class HabitHistory {
  static instance = new HabitHistory();
  constructor() {
    if (HabitHistory.instance) {
      return HabitHistory.instance;
    }
  }

  init() {
    this.trigger = document.querySelector('#open-history');
    this.dialog = document.querySelector('#habits-history-dialog');

    this._open = false;

    this.trigger.addEventListener('click', () => {
      this.open = true;
    });
  }

  get open() {
    return this._open;
  }

  set open(value) {
    this._open = value;

    if (this._open) {
      this.dialog.setAttribute('open', '');
      // Update or render the history
      this.render();
    } else {
      this.dialog.removeAttribute('open');
    }
  }

  async render() {
    const habits = await getAllHabits();
    const lowestDate = getLowestDate(habits);
    const dates = getDatesRange(lowestDate);
    const table = document.createElement('table');

    table.appendChild(createTableHeader(dates));
    createTableRows(habits, dates).forEach((row) => table.appendChild(row));

    const tableWrapper = document.querySelector('#table-wrapper');
    tableWrapper.innerHTML = '';
    tableWrapper.appendChild(table);
  }
}

const getLowestDate = (habits) => {
  return habits
    .reduce((acc, habit) => {
      return [...acc, ...Object.keys(habit.doneDays)];
    }, [])
    .map((date) => new Date(date))
    .sort((a, b) => a - b)[0];
};

const getDatesRange = (lowestDate) => {
  const diff = Math.ceil((new Date() - lowestDate) / (1000 * 60 * 60 * 24));
  return Array.from({ length: diff + 1 }).map((_, index) => {
    const date = new Date(lowestDate);
    date.setDate(date.getDate() + index);
    return date.toISOString().split('T')[0];
  });
};

const createTableHeader = (dates) => {
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Habit';
  headerRow.appendChild(headerCell);

  dates.forEach((date) => {
    const headerCell = document.createElement('th');
    headerCell.textContent = date;
    headerRow.appendChild(headerCell);
  });

  return headerRow;
};

const createTableRows = (habits, dates) => {
  const rows = [];
  habits.forEach((habit) => {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = habit.title;
    row.appendChild(cell);

    dates.forEach((date) => {
      const cell = document.createElement('td');
      const doneDay = habit.doneDays[date];
      cell.textContent = doneDay ? '✅' : '❌';
      row.appendChild(cell);
    });

    rows.push(row);
  });

  return rows;
};
