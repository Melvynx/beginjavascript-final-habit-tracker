import './style.css';
import { AddHabitDialog } from './ui/AddHabitDialog';
import { HabitHistory } from './ui/HistoryHabit';
import { TodayHabits } from './ui/TodayHabit';

TodayHabits.instance.init();

AddHabitDialog.instance.init();

HabitHistory.instance.init();
