import { createContext, useContext, useState } from 'react';
import {
  AMBASSADORS,
  TASKS,
  BADGES,
  REWARDS,
  WEEKLY_ACTIVITY,
  COLLEGE_BATTLE,
  PROGRAM_STATS,
} from '../data/mockData';
import { checkBadgeUnlocks, getLevelFromPoints } from '../utils/gameEngine';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [ambassadors, setAmbassadors] = useState(AMBASSADORS);
  const [tasks, setTasks] = useState(TASKS);

  // ── Live lookup — always returns the freshest ambassador object ──
  const getCurrentAmbassador = (userId) => {
    return ambassadors.find(a => a.id === userId) ?? null;
  };

  // ── Complete a task: updates ambassadors[] AND syncs AuthContext user ──
  const completeTask = (userId, taskId, updateUserFn) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let updatedAmb = null;

    setAmbassadors(prev => prev.map(amb => {
      if (amb.id !== userId) return amb;
      const newPoints        = amb.points + task.points;
      const newTasksCompleted = amb.tasksCompleted + 1;
      const newBadges        = checkBadgeUnlocks({
        ...amb,
        points: newPoints,
        tasksCompleted: newTasksCompleted,
      });
      updatedAmb = {
        ...amb,
        points:         newPoints,
        tasksCompleted: newTasksCompleted,
        badges:         newBadges,
        level:          getLevelFromPoints(newPoints).name,
      };
      return updatedAmb;
    }));

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completions: t.completions + 1 } : t
    ));

    // ── Sync AuthContext so Dashboard re-renders immediately ──
    if (typeof updateUserFn === 'function' && updatedAmb) {
      updateUserFn({
        points:         updatedAmb.points,
        tasksCompleted: updatedAmb.tasksCompleted,
        badges:         updatedAmb.badges,
        level:          updatedAmb.level,
      });
    }
  };

  // ── Sorted leaderboard ──
  const getLeaderboard = () => {
    return [...ambassadors]
      .sort((a, b) => b.points - a.points)
      .map((amb, i) => ({ ...amb, rank: i + 1 }));
  };

  return (
    <DataContext.Provider value={{
      ambassadors,
      tasks,
      badges:            BADGES,
      rewards:           REWARDS,
      weeklyActivity:    WEEKLY_ACTIVITY,
      collegeBattle:     COLLEGE_BATTLE,
      programStats:      PROGRAM_STATS,
      completeTask,
      getCurrentAmbassador,
      getLeaderboard,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);