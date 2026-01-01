/**
 * Challenge Service
 * Handles OpenAI API integration for challenge generation
 */

// OpenAI API Configuration
// NOTE: Set your OpenAI API key as an environment variable or replace the placeholder
// For React Native, you can use react-native-config or similar package
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';
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
      // Get detailed error information
      // Read response as text first (can only read once)
      let errorMessage = `OpenAI API error: ${response.status} ${response.statusText || 'Unknown error'}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            // Try to parse as JSON
            const errorData = JSON.parse(errorText);
            if (errorData.error) {
              errorMessage = `OpenAI API error (${response.status}): ${errorData.error.message || errorData.error.type || 'Unknown error'}`;
              if (errorData.error.code) {
                errorMessage += ` [Code: ${errorData.error.code}]`;
              }
            } else {
              errorMessage = `OpenAI API error (${response.status}): ${errorText.substring(0, 200)}`;
            }
          } catch (jsonError) {
            // Not JSON, use text as is
            errorMessage = `OpenAI API error (${response.status}): ${errorText.substring(0, 200)}`;
          }
        }
      } catch (textError) {
        // If we can't read the response body, use status
        errorMessage = `OpenAI API error: ${response.status} ${response.statusText || 'Request failed'}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Check if response has the expected structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }
    
    const challengeText = data.choices[0].message.content;
    
    if (!challengeText) {
      throw new Error('Empty response from OpenAI API');
    }
    
    // Parse the JSON response
    let challenge;
    try {
      challenge = JSON.parse(challengeText);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = challengeText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        challenge = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
    }
    
    // Add metadata
    return {
      ...challenge,
      id: `challenge_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
    };
  } catch (error) {
    // Enhanced error logging
    console.error('Error generating challenge:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      goal: goal,
      difficulty: difficulty,
      duration: duration,
      apiKeyPresent: !!OPENAI_API_KEY && OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE',
    });
    
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
  // Import challengeProgress utility
  const challengeProgress = require('../utils/challengeProgress');
  
  // This function is typically called from actions, but can be used directly
  // The actual update happens in the store via actions
  const clampedProgress = Math.min(100, Math.max(0, progress));
  console.log(`Updating challenge ${challengeId} progress to ${clampedProgress}%`);
  
  return clampedProgress;
};

/**
 * Calculate and update challenge progress automatically
 * @param {Object} challenge - Challenge object
 * @returns {Object} Updated challenge with progress
 */
export const calculateAndUpdateProgress = (challenge) => {
  const challengeProgress = require('../utils/challengeProgress');
  return challengeProgress.updateChallengeProgress(challenge);
};

export default {
  generateChallenge,
  generateChallengeOptions,
  updateChallengeProgress,
};
