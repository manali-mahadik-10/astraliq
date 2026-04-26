import { LEVELS, BADGES } from '../data/mockData';

// Get level object from points
export const getLevelFromPoints = (points) => {
  return LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0];
};

// Get progress % to next level
export const getLevelProgress = (points) => {
  const level = getLevelFromPoints(points);
  if (level.max === Infinity) return 100;
  const range = level.max - level.min;
  const progress = points - level.min;
  return Math.round((progress / range) * 100);
};

// Get points needed for next level
export const getPointsToNextLevel = (points) => {
  const level = getLevelFromPoints(points);
  if (level.max === Infinity) return 0;
  return level.max - points + 1;
};

// Get badge objects from badge ids
export const getBadgeObjects = (badgeIds) => {
  return BADGES.filter(b => badgeIds.includes(b.id));
};

// Check which badges should be unlocked
export const checkBadgeUnlocks = (user) => {
  const unlocked = [...(user.badges || [])];

  if (!unlocked.includes('newcomer')) unlocked.push('newcomer');
  if (user.tasksCompleted >= 1 && !unlocked.includes('first_task')) unlocked.push('first_task');
  if (user.streak >= 7 && !unlocked.includes('on_fire')) unlocked.push('on_fire');
  if (user.points >= 1000 && !unlocked.includes('century')) unlocked.push('century');
  if (user.rank <= 10 && !unlocked.includes('top_10')) unlocked.push('top_10');

  return unlocked;
};

// Calculate streak bonus points
export const getStreakBonus = (streak) => {
  if (streak >= 30) return 100;
  if (streak >= 14) return 50;
  if (streak >= 7) return 30;
  if (streak >= 3) return 20;
  return 10;
};

// Get rank medal
export const getRankMedal = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

// Get difficulty stars
export const getDifficultyStars = (difficulty) => {
  return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
};

// Calculate program health score
export const calcProgramHealth = (stats) => {
  const engagementScore = stats.engagementRate * 0.4;
  const retentionScore = stats.retentionRate * 0.4;
  const completionScore = Math.min((stats.tasksCompleted / stats.totalAmbassadors) * 10, 20);
  return Math.round(engagementScore + retentionScore + completionScore);
};

// Format big numbers
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Get time since date
export const getTimeSince = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};