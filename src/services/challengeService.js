/**
 * Challenge Service
 * Handles OpenAI API integration for challenge generation
 */

// TODO: Add your OpenAI API key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Generate a challenge using OpenAI API
 * @param {Object} params - Challenge generation parameters
 * @param {string} params.goal - The goal for which to generate a challenge
 * @param {string} params.difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @param {number} params.duration - Duration in days
 * @param {string} params.userContext - Additional context about the user
 * @returns {Promise<Object>} Generated challenge object
 */
export const generateChallenge = async ({
  goal,
  difficulty = 'medium',
  duration = 7,
  userContext = '',
}) => {
  try {
    const prompt = `Generate a ${difficulty} challenge for the following goal: "${goal}". 
    The challenge should last ${duration} days. 
    ${userContext ? `User context: ${userContext}` : ''}
    
    Return a JSON object with the following structure:
    {
      "title": "Challenge title",
      "description": "Detailed description of the challenge",
      "duration": ${duration},
      "difficulty": "${difficulty}",
      "dailyTasks": ["task1", "task2", "task3"],
      "milestones": ["milestone1", "milestone2"],
      "tips": ["tip1", "tip2", "tip3"]
    }`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates personalized challenges for goal achievement. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const challengeText = data.choices[0].message.content;
    
    // Parse the JSON response
    const challenge = JSON.parse(challengeText);
    
    // Add metadata
    return {
      ...challenge,
      id: `challenge_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
    };
  } catch (error) {
    console.error('Error generating challenge:', error);
    
    // Return a fallback challenge if API fails
    return {
      id: `challenge_${Date.now()}`,
      title: `${goal} Challenge`,
      description: `A ${difficulty} challenge to help you achieve your goal: ${goal}`,
      duration,
      difficulty,
      dailyTasks: [
        'Set aside time each day to work on your goal',
        'Track your progress daily',
        'Reflect on your achievements',
      ],
      milestones: [
        `Complete first week of ${goal}`,
        `Reach halfway point`,
      ],
      tips: [
        'Stay consistent',
        'Celebrate small wins',
        'Don\'t be too hard on yourself',
      ],
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
    };
  }
};

/**
 * Generate multiple challenge options
 * @param {Object} params - Challenge generation parameters
 * @returns {Promise<Array>} Array of challenge options
 */
export const generateChallengeOptions = async (params) => {
  const difficulties = ['easy', 'medium', 'hard'];
  const challenges = await Promise.all(
    difficulties.map(difficulty =>
      generateChallenge({ ...params, difficulty })
    )
  );
  return challenges;
};

/**
 * Update challenge progress
 * @param {string} challengeId - Challenge ID
 * @param {number} progress - Progress percentage (0-100)
 */
export const updateChallengeProgress = (challengeId, progress) => {
  // This would typically update the challenge in the store or backend
  // For now, it's a placeholder
  console.log(`Updating challenge ${challengeId} progress to ${progress}%`);
};

export default {
  generateChallenge,
  generateChallengeOptions,
  updateChallengeProgress,
};
