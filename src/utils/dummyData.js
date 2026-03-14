/**
 * Dummy Data Utility
 * Populates store with realistic test data to visualize all features
 */

import useStore from '../state/store';

/**
 * Generate dummy daily breakdown for challenges (for charts)
 */
const generateDailyBreakdown = (days, activityType, targetValue) => {
  const breakdown = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate realistic values with some variation
    let value = 0;
    let completed = false;
    
    switch (activityType) {
      case 'steps':
        value = Math.floor(targetValue * (0.7 + Math.random() * 0.6)); // 70-130% of target
        if (i === days - 1) value = Math.floor(targetValue * 0.85); // Today: 85% progress
        completed = value >= targetValue;
        break;
      case 'calories':
        value = Math.floor(targetValue * (0.6 + Math.random() * 0.8));
        if (i === days - 1) value = Math.floor(targetValue * 0.9);
        completed = value >= targetValue;
        break;
      case 'distance':
        value = parseFloat((targetValue * (0.65 + Math.random() * 0.7)).toFixed(1));
        if (i === days - 1) value = parseFloat((targetValue * 0.88).toFixed(1));
        completed = value >= targetValue;
        break;
      case 'activeTime':
        value = Math.floor(targetValue * (0.65 + Math.random() * 0.8));
        if (i === days - 1) value = Math.floor(targetValue * 0.87);
        completed = value >= targetValue;
        break;
      case 'goal':
        value = Math.floor((targetValue || 10000) * (0.7 + Math.random() * 0.6));
        if (i === days - 1) value = Math.floor((targetValue || 10000) * 0.85);
        completed = value >= (targetValue || 10000);
        break;
      case 'consistency':
        value = Math.random() > 0.2 ? 1 : 0; // 80% chance of activity
        completed = value > 0;
        break;
      default:
        value = Math.floor(targetValue * (0.7 + Math.random() * 0.6));
        completed = value >= targetValue;
    }
    
    breakdown.push({
      date: dateStr,
      value: value,
      completed: completed,
    });
  }
  
  return breakdown;
};

/**
 * Generate dummy daily completions object
 */
const generateDailyCompletions = (days, completionRate = 0.8) => {
  const completions = {};
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    
    // Mark as completed based on completion rate
    if (Math.random() < completionRate) {
      completions[dateStr] = true;
    }
  }
  
  return completions;
};

/**
 * Generate dummy challenge with full progress data
 */
const generateDummyChallenge = (template, startDateOffset = 0) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDateOffset);
  startDate.setHours(0, 0, 0, 0);
  
  const targetValue = template.targetValue || (template.activityType === 'goal' ? 10000 : null);
  const dailyBreakdown = generateDailyBreakdown(
    template.duration, 
    template.activityType, 
    targetValue || 10000
  );
  
  const dailyCompletions = generateDailyCompletions(template.duration, 0.85);
  
  // Calculate progress
  const daysCompleted = Object.keys(dailyCompletions).length;
  const progress = Math.min(Math.round((daysCompleted / template.duration) * 100), 100);
  
  // Calculate reached milestones
  const milestonesReached = [];
  if (template.milestones) {
    template.milestones.forEach(milestone => {
      if (daysCompleted >= milestone.day) {
        milestonesReached.push(milestone.day);
      }
    });
  }
  
  // Store daily activity history
  const dailyActivityHistory = {};
  dailyBreakdown.forEach(day => {
    dailyActivityHistory[day.date] = day.value;
  });
  
  // Calculate stats for progress object
  const values = dailyBreakdown.map(d => d.value || 0);
  const currentValue = values.reduce((sum, val) => sum + val, 0);
  const averageDaily = currentValue / dailyBreakdown.length;
  const completedDays = dailyBreakdown.filter(d => d.completed).length;
  
  const bestDay = dailyBreakdown.reduce((best, day) => {
    return (!best || (day.value || 0) > (best.value || 0)) ? day : best;
  }, null);
  
  const worstDay = dailyBreakdown.reduce((worst, day) => {
    const dayValue = day.value || 0;
    const worstValue = worst ? (worst.value || 0) : Infinity;
    return dayValue > 0 && dayValue < worstValue ? day : worst;
  }, null);
  
  const challenge = {
    ...template,
    id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: startDate.toISOString(),
    status: progress >= 100 ? 'completed' : 'active',
    progress: {
      percentage: progress,
      dailyBreakdown: dailyBreakdown,
      currentValue: currentValue,
      averageDaily: averageDaily,
      bestDay: bestDay,
      worstDay: worstDay,
      daysCompleted: completedDays,
      weeklyTrend: Math.random() > 0.4 ? 'improving' : (Math.random() > 0.5 ? 'stable' : 'declining'),
    },
    dailyCompletions: dailyCompletions,
    dailyTaskCompletions: {},
    dailyActivityHistory: dailyActivityHistory,
    milestonesReached: milestonesReached,
    points: daysCompleted * 10,
  };
  
  return challenge;
};

/**
 * Generate dummy daily step history (last 30 days)
 */
const generateDailyStepHistory = () => {
  const history = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate realistic step counts
    const steps = Math.floor(6000 + Math.random() * 8000); // 6K-14K steps
    const calories = Math.floor(steps * 0.04); // ~40 cal per 1000 steps
    const distance = parseFloat((steps * 0.7 / 1000).toFixed(2)); // 0.7m stride
    const activeTime = Math.floor(steps / 100); // ~100 steps per minute
    
    history.push({
      date: dateStr,
      steps: steps,
      calories: calories,
      distance: distance,
      activeTime: activeTime,
    });
  }
  
  return history;
};

/**
 * Initialize store with dummy data
 */
export const initializeDummyData = () => {
  const store = useStore.getState();
  
  // Import challenge templates
  const { getChallengeTemplate } = require('../data/challengeTemplates');
  
  // 1. Set up user profile
  store.setUser({
    id: 'user_dummy_001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    weight: 75, // kg
    height: 175, // cm
    strideLength: 0.75, // meters
    dailyStepGoal: 10000,
    onboardingCompleted: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  });
  
  // 2. Set up streak (15 days current, 25 longest)
  store.setStreak({
    currentStreak: 15,
    longestStreak: 25,
    lastActivityDate: new Date().toISOString(),
  });
  
  // 3. Clear existing challenges first
  store.setChallenges([]);
  store.setActiveChallenge(null);
  
  // 4. Create active challenge (7 days, currently on day 4)
  const activeTemplate = getChallengeTemplate('10k_steps_7d');
  if (activeTemplate) {
    const activeChallenge = generateDummyChallenge(activeTemplate, 3); // Started 3 days ago
    store.addChallenge(activeChallenge);
    store.setActiveChallenge(activeChallenge);
  }
  
  // 5. Create additional challenges for history
  const challenge1 = getChallengeTemplate('10k_steps_14d');
  if (challenge1) {
    const completedChallenge = generateDummyChallenge(challenge1, 20); // Completed 20 days ago
    completedChallenge.status = 'completed';
    completedChallenge.progress.percentage = 100;
    completedChallenge.completedAt = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    // Mark all days as completed for completed challenge
    completedChallenge.dailyCompletions = generateDailyCompletions(challenge1.duration, 1.0);
    // Update all dailyBreakdown to show completed
    completedChallenge.progress.dailyBreakdown = completedChallenge.progress.dailyBreakdown.map(day => ({
      ...day,
      completed: true,
    }));
    store.addChallenge(completedChallenge);
  }
  
  const challenge2 = getChallengeTemplate('burn_500_cal_7d');
  if (challenge2) {
    const anotherChallenge = generateDummyChallenge(challenge2, 10); // Started 10 days ago, completed
    anotherChallenge.status = 'completed';
    anotherChallenge.progress.percentage = 100;
    anotherChallenge.completedAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    anotherChallenge.dailyCompletions = generateDailyCompletions(challenge2.duration, 1.0);
    anotherChallenge.progress.dailyBreakdown = anotherChallenge.progress.dailyBreakdown.map(day => ({
      ...day,
      completed: true,
    }));
    store.addChallenge(anotherChallenge);
  }
  
  // 6. Set activity tracking (today's progress)
  store.setActivityTracking({
    todaySteps: 8500, // 85% of daily goal
    todayCalories: 340, // ~40 cal per 1000 steps
    todayDistance: 6.375, // km (8500 * 0.75m / 1000)
    todayActiveTime: 85, // minutes (8500 / 100)
    baselineSteps: 0,
    lastUpdate: new Date().toISOString(),
    lastResetDate: new Date().toISOString().split('T')[0],
  });
  
  // 7. Set daily step history (last 30 days)
  store.clearDailyStepHistory(); // Clear existing
  const dailyHistory = generateDailyStepHistory();
  dailyHistory.forEach(record => {
    store.addDailyStepRecord(record);
  });
  
  // 8. Separate active and completed challenges
  const allChallenges = store.challenges;
  const activeChallenges = allChallenges.filter(c => c.status === 'active');
  const completedChallenges = allChallenges.filter(c => c.status === 'completed');
  
  // Set active challenges
  store.setChallenges(activeChallenges);
  
  // Set active challenge if there is one
  if (activeChallenges.length > 0) {
    const currentActive = activeChallenges.find(c => c.id === store.activeChallenge?.id);
    if (currentActive) {
      store.setActiveChallenge(currentActive);
    } else {
      store.setActiveChallenge(activeChallenges[0]);
    }
  } else {
    store.setActiveChallenge(null);
  }
  
  // Set completed challenges
  if (completedChallenges.length > 0) {
    useStore.setState({ completedChallenges: completedChallenges });
  }
  
  console.log('✅ Dummy data initialized successfully!');
  console.log('- User:', store.user.name);
  console.log('- Streak:', store.streak.currentStreak, 'days');
  console.log('- Active Challenge:', store.activeChallenge?.title);
  console.log('- Active Challenges:', store.challenges.length);
  console.log('- Completed Challenges:', store.completedChallenges.length);
  console.log('- Daily History Records:', store.dailyStepHistory.length);
};

/**
 * Reset to dummy data (clear first, then initialize)
 */
export const resetToDummyData = () => {
  useStore.getState().reset();
  setTimeout(() => {
    initializeDummyData();
  }, 100);
};

export default {
  initializeDummyData,
  resetToDummyData,
  generateDummyChallenge,
  generateDailyBreakdown,
  generateDailyStepHistory,
};