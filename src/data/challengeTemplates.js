/**
 * Local Challenge Templates
 * Pre-defined challenges that work offline (no API needed)
 */

export const challengeTemplates = {
  fitness: [
    {
      id: '10k_steps_7d',
      title: '10K Steps Daily',
      description: 'Walk 10,000 steps every day for 7 days. Build a healthy walking habit!',
      category: 'fitness',
      difficulty: 'medium',
      duration: 7,
      activityType: 'steps',
      targetValue: 10000,
      dailyTasks: [
        'Walk 10,000 steps',
        'Track your progress',
        'Stay consistent',
      ],
      milestones: [
        { day: 3, message: '3 days strong! 🔥 Keep going!', badge: 'bronze' },
        { day: 5, message: 'Halfway there! 💪 You\'re amazing!', badge: 'silver' },
        { day: 7, message: 'Challenge complete! 🎉 You did it!', badge: 'gold' },
      ],
      tips: [
        'Take the stairs instead of the elevator',
        'Park further away from your destination',
        'Take short walks during breaks',
        'Use a pedometer to track your progress',
      ],
      icon: 'walk',
    },
    {
      id: '10k_steps_14d',
      title: '10K Steps Challenge',
      description: 'Walk 10,000 steps daily for 14 days. Build a strong walking routine!',
      category: 'fitness',
      difficulty: 'hard',
      duration: 14,
      activityType: 'steps',
      targetValue: 10000,
      dailyTasks: [
        'Walk 10,000 steps',
        'Track your progress',
        'Stay consistent',
      ],
      milestones: [
        { day: 5, message: 'First week complete! 🔥', badge: 'bronze' },
        { day: 10, message: 'Double digits! 💪', badge: 'silver' },
        { day: 14, message: 'Two weeks strong! 🎉', badge: 'gold' },
      ],
      tips: [
        'Set reminders throughout the day',
        'Walk with friends or family',
        'Listen to music or podcasts while walking',
        'Track your progress daily',
      ],
      icon: 'walk',
    },
    {
      id: '15k_steps_7d',
      title: '15K Steps Challenge',
      description: 'Push yourself with 15,000 steps daily for 7 days!',
      category: 'fitness',
      difficulty: 'hard',
      duration: 7,
      activityType: 'steps',
      targetValue: 15000,
      dailyTasks: [
        'Walk 15,000 steps',
        'Track your progress',
        'Stay active throughout the day',
      ],
      milestones: [
        { day: 3, message: '3 days of 15K! 🔥', badge: 'bronze' },
        { day: 5, message: 'More than halfway! 💪', badge: 'silver' },
        { day: 7, message: 'Challenge complete! 🎉', badge: 'gold' },
      ],
      tips: [
        'Start your day with a morning walk',
        'Take longer routes when possible',
        'Use a fitness tracker',
        'Stay hydrated',
      ],
      icon: 'run',
    },
    {
      id: 'burn_500_cal_7d',
      title: 'Burn 500 Calories Daily',
      description: 'Burn 500 calories through physical activity every day for 7 days!',
      category: 'fitness',
      difficulty: 'medium',
      duration: 7,
      activityType: 'calories',
      targetValue: 500,
      dailyTasks: [
        'Burn 500 calories',
        'Track your activity',
        'Stay consistent',
      ],
      milestones: [
        { day: 3, message: '3 days of burning! 🔥', badge: 'bronze' },
        { day: 5, message: 'Halfway there! 💪', badge: 'silver' },
        { day: 7, message: 'Challenge complete! 🎉', badge: 'gold' },
      ],
      tips: [
        'Mix cardio and strength training',
        'Try high-intensity workouts',
        'Stay active throughout the day',
        'Track your calories burned',
      ],
      icon: 'fire',
    },
    {
      id: 'complete_daily_goal_7d',
      title: 'Complete Daily Goal',
      description: 'Reach your daily step goal every day for 7 days!',
      category: 'fitness',
      difficulty: 'medium',
      duration: 7,
      activityType: 'goal',
      targetValue: null, // Uses user's daily goal
      dailyTasks: [
        'Reach your daily step goal',
        'Track your progress',
        'Stay motivated',
      ],
      milestones: [
        { day: 3, message: '3 days of goals! 🔥', badge: 'bronze' },
        { day: 5, message: 'Halfway there! 💪', badge: 'silver' },
        { day: 7, message: 'Perfect week! 🎉', badge: 'gold' },
      ],
      tips: [
        'Set a realistic daily goal',
        'Track your progress',
        'Celebrate small wins',
        'Stay consistent',
      ],
      icon: 'target',
    },
  ],
  health: [
    {
      id: 'walk_5km_7d',
      title: 'Walk 5KM Daily',
      description: 'Walk 5 kilometers every day for 7 days. Great for cardiovascular health!',
      category: 'health',
      difficulty: 'easy',
      duration: 7,
      activityType: 'distance',
      targetValue: 5, // km
      dailyTasks: [
        'Walk 5 kilometers',
        'Track your distance',
        'Enjoy the journey',
      ],
      milestones: [
        { day: 3, message: '3 days walking! 🔥', badge: 'bronze' },
        { day: 5, message: 'Halfway there! 💪', badge: 'silver' },
        { day: 7, message: 'Challenge complete! 🎉', badge: 'gold' },
      ],
      tips: [
        'Choose scenic routes',
        'Walk at a comfortable pace',
        'Wear comfortable shoes',
        'Stay hydrated',
      ],
      icon: 'map-marker-distance',
    },
    {
      id: 'active_30min_7d',
      title: '30 Minutes Active',
      description: 'Stay active for at least 30 minutes every day for 7 days!',
      category: 'health',
      difficulty: 'easy',
      duration: 7,
      activityType: 'activeTime',
      targetValue: 30, // minutes
      dailyTasks: [
        'Stay active for 30 minutes',
        'Track your active time',
        'Have fun!',
      ],
      milestones: [
        { day: 3, message: '3 days active! 🔥', badge: 'bronze' },
        { day: 5, message: 'Halfway there! 💪', badge: 'silver' },
        { day: 7, message: 'Challenge complete! 🎉', badge: 'gold' },
      ],
      tips: [
        'Mix different activities',
        'Find activities you enjoy',
        'Track your time',
        'Stay consistent',
      ],
      icon: 'timer',
    },
  ],
  wellness: [
    {
      id: 'consistency_7d',
      title: '7 Days Consistency',
      description: 'Maintain consistent activity for 7 days. Build healthy habits!',
      category: 'wellness',
      difficulty: 'medium',
      duration: 7,
      activityType: 'consistency',
      targetValue: null,
      dailyTasks: [
        'Stay active daily',
        'Track your progress',
        'Build the habit',
      ],
      milestones: [
        { day: 3, message: '3 days consistent! 🔥', badge: 'bronze' },
        { day: 5, message: 'Halfway there! 💪', badge: 'silver' },
        { day: 7, message: 'Habit formed! 🎉', badge: 'gold' },
      ],
      tips: [
        'Start small and build up',
        'Track your progress',
        'Stay motivated',
        'Celebrate consistency',
      ],
      icon: 'calendar-check',
    },
  ],
};

/**
 * Get challenge template by ID
 */
export const getChallengeTemplate = (templateId) => {
  for (const category of Object.values(challengeTemplates)) {
    const template = category.find(t => t.id === templateId);
    if (template) return template;
  }
  return null;
};

/**
 * Get challenges by category
 */
export const getChallengesByCategory = (category) => {
  return challengeTemplates[category] || [];
};

/**
 * Get all challenge templates
 */
export const getAllChallengeTemplates = () => {
  return Object.values(challengeTemplates).flat();
};

/**
 * Get suggested challenges based on user activity
 */
export const getSuggestedChallenges = (userActivity, dailyGoal) => {
  const suggestions = [];
  
  // Suggest based on current step count
  if (userActivity.todaySteps >= 8000) {
    suggestions.push(getChallengeTemplate('10k_steps_7d'));
  } else if (userActivity.todaySteps >= 5000) {
    suggestions.push(getChallengeTemplate('walk_5km_7d'));
  }
  
  // Suggest based on daily goal completion
  if (dailyGoal && userActivity.todaySteps >= dailyGoal * 0.8) {
    suggestions.push(getChallengeTemplate('complete_daily_goal_7d'));
  }
  
  // Always include consistency challenge
  suggestions.push(getChallengeTemplate('consistency_7d'));
  
  return suggestions.filter(Boolean);
};

export default challengeTemplates;
