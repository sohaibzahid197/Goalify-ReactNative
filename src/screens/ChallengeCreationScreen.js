/**
 * Challenge Creation Screen
 * Allows users to create a new challenge
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Dimensions, Animated, Modal } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Input, Button, Card, Badge } from '../components';
import { useChallenge } from '../hooks/useChallenge';
import { validateGoal } from '../utils/validation';
import { getAllChallengeTemplates, getChallengesByCategory } from '../data/challengeTemplates';
import { GRADIENTS } from '../assets/colors';
import { scaleFontSize, scaleSize, scaleIcon, createSpacedStyles, spacedItem, SCREEN_WIDTH, SCREEN_HEIGHT } from '../utils/responsive';
import { safeColors } from '../utils/themeColors';
import { formatDuration, getDurationOptions } from '../utils/durationFormatter';

const { height: SCREEN_HEIGHT_REF } = Dimensions.get('window');

function ChallengeCreationScreen({ navigation }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { createChallenge } = useChallenge();
  
  const [mode, setMode] = useState('template'); // 'template' or 'custom'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [category, setCategory] = useState('fitness');
  const [goal, setGoal] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(7);
  const [loading, setLoading] = useState(false);
  const [goalError, setGoalError] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const templates = getChallengesByCategory(category);
  const successAnimRef = useRef(null);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Beginner friendly', icon: 'speedometer-slow' },
    { value: 'medium', label: 'Medium', description: 'Moderate', icon: 'speedometer-medium' },
    { value: 'hard', label: 'Hard', description: 'Advanced', icon: 'speedometer' },
  ];

  const durations = getDurationOptions();

  const handleGoalChange = (text) => {
    setGoal(text);
    setGoalError('');
  };

  const handleCreateChallenge = async () => {
    setLoading(true);
    try {
      let challenge;

      if (mode === 'template' && selectedTemplate) {
        // Create from template
        console.log('📝 Creating challenge from template:', selectedTemplate.id);
        challenge = await createChallenge({
          templateId: selectedTemplate.id,
        });
        console.log('✅ Challenge created from template:', challenge?.id, challenge?.title);
      } else {
        // Create custom challenge
        const validation = validateGoal(goal);
        if (!validation.isValid) {
          setGoalError(validation.error);
          Alert.alert('Validation Error', validation.error);
          setLoading(false);
          return;
        }

        console.log('📝 Creating custom challenge:', validation.value);
        challenge = await createChallenge({
          goal: validation.value,
          difficulty,
          duration,
          category,
        });
        console.log('✅ Custom challenge created:', challenge?.id, challenge?.title);
      }

      // Verify challenge was created and set as active
      const store = require('../state/store').default;
      const state = store.getState();
      console.log('🔍 After creation - activeChallenge:', state.activeChallenge?.id, state.activeChallenge?.title);
      console.log('🔍 After creation - activeChallenge details:', JSON.stringify(state.activeChallenge));
      console.log('🔍 After creation - all challenges:', state.challenges.length);

      // Verify challenge exists and has required data
      if (!state.activeChallenge || !state.activeChallenge.id) {
        console.error('❌ Challenge creation failed - no activeChallenge in store');
        throw new Error('Challenge was not properly created');
      }

      // Show success animation instead of alert
      setLoading(false);
      setShowSuccessAnimation(true);

      // Play animation and navigate after it completes
      setTimeout(() => {
        if (successAnimRef.current) {
          successAnimRef.current.play();
        }
      }, 50);

      // Navigate after animation (1.2 seconds - optimized for quick feedback)
      setTimeout(() => {
        console.log('👈 Going back to HomeScreen');
        setShowSuccessAnimation(false);
        navigation.goBack();
      }, 1200);
    } catch (error) {
      console.error('Error creating challenge:', error);
      Alert.alert(
        'Error',
        'Failed to create challenge. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'fitness': return 'dumbbell';
      case 'health': return 'heart-pulse';
      case 'wellness': return 'leaf';
      default: return 'target';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'fitness': return '#06b6d4'; // Teal
      case 'health': return '#f97316'; // Orange
      case 'wellness': return '#10b981'; // Green
      default: return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Beautiful Gradient Header */}
      <LinearGradient
        colors={GRADIENTS?.headerGradient || ['#06b6d4', '#0891b2', '#0e7490']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientHeader, { paddingTop: Math.max(insets.top + 16, 20) }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: safeColors.white + '33' }]}
          >
            <Icon name="arrow-left" size={scaleIcon(24)} color={safeColors.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Create Challenge</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Mode Selection - Beautiful Toggle */}
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                {
                  backgroundColor: mode === 'template' ? theme.colors.primary : theme.colors.surfaceVariant,
                  shadowColor: mode === 'template' ? theme.colors.primary : '#000',
                },
                mode === 'template' && styles.modeButtonActive,
              ]}
              onPress={() => setMode('template')}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIconContainer, mode === 'template' && { backgroundColor: theme.colors.primary + '33' }]}>
                <Icon 
                  name="format-list-bulleted" 
                  size={scaleIcon(22)} 
                  color={mode === 'template' ? safeColors.white : theme.colors.onSurfaceVariant} 
                />
              </View>
              <Text style={[
                styles.modeText, 
                { color: mode === 'template' ? safeColors.white : theme.colors.onSurfaceVariant },
                mode === 'template' && styles.modeTextActive
              ]}>
                Templates
              </Text>
              {mode === 'template' && (
                <View style={styles.modeIndicator}>
                  <Icon name="check-circle" size={scaleIcon(16)} color={safeColors.white} />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                {
                  backgroundColor: mode === 'custom' ? theme.colors.primary : theme.colors.surfaceVariant,
                  shadowColor: mode === 'custom' ? theme.colors.primary : '#000',
                },
                mode === 'custom' && styles.modeButtonActive,
              ]}
              onPress={() => setMode('custom')}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIconContainer, mode === 'custom' && { backgroundColor: theme.colors.primary + '33' }]}>
                <Icon 
                  name="pencil" 
                  size={scaleIcon(22)} 
                  color={mode === 'custom' ? safeColors.white : theme.colors.onSurfaceVariant} 
                />
              </View>
              <Text style={[
                styles.modeText, 
                { color: mode === 'custom' ? safeColors.white : theme.colors.onSurfaceVariant },
                mode === 'custom' && styles.modeTextActive
              ]}>
                Custom
              </Text>
              {mode === 'custom' && (
                <View style={styles.modeIndicator}>
                  <Icon name="check-circle" size={scaleIcon(16)} color={safeColors.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Card variant="elevated" style={styles.formCard}>

        {mode === 'template' ? (
          <>
            {/* Category Selection - Beautiful Pills */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="apps" size={scaleIcon(20)} color={theme.colors.primary} style={{ marginRight: scaleSize(8) }} />
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                  Category
                </Text>
              </View>
              <View style={styles.categoryContainer}>
                {['fitness', 'health', 'wellness'].map((cat) => {
                  const isSelected = category === cat;
                  const categoryColor = getCategoryColor(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        {
                          borderWidth: isSelected ? 2 : 0,
                          borderColor: isSelected ? categoryColor : 'transparent',
                          backgroundColor: isSelected ? categoryColor : theme.colors.surfaceVariant,
                        },
                        isSelected && {
                          transform: [{ scale: 1.05 }],
                        },
                      ]}
                      onPress={() => {
                        setCategory(cat);
                        setSelectedTemplate(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.categoryIconContainer,
                        isSelected && { backgroundColor: safeColors.white + '33' }
                      ]}>
                        <Icon 
                          name={getCategoryIcon(cat)} 
                          size={scaleIcon(18)} 
                          color={isSelected ? safeColors.white : categoryColor} 
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryText,
                          { color: isSelected ? safeColors.white : theme.colors.onSurface },
                          isSelected && styles.categoryTextActive
                        ]}
                        numberOfLines={1}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Template Selection - Stunning Cards */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="star" size={scaleIcon(20)} color={theme.colors.warning || '#FF9800'} style={{ marginRight: scaleSize(8) }} />
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                  Challenges
                </Text>
              </View>
              <ScrollView 
                style={styles.templatesList} 
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {templates.map((template, index) => {
                  const isSelected = selectedTemplate?.id === template.id;
                  return (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.templateCard,
                        {
                          borderWidth: isSelected ? 2 : 0,
                          borderColor: isSelected ? theme.colors.primary : 'transparent',
                          backgroundColor: theme.colors.surface,
                        },
                        isSelected && styles.templateCardSelected,
                        isSelected && {
                          shadowColor: theme.colors.primary,
                        },
                      ]}
                      onPress={() => setSelectedTemplate(template)}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={[theme.colors.primary + '15', 'transparent']}
                          style={styles.templateGradient}
                        />
                      )}
                      <View style={styles.templateHeader}>
                        <View style={[
                          styles.templateIconContainer,
                          isSelected && { backgroundColor: theme.colors.primary }
                        ]}>
                          <Icon 
                            name={template.icon || 'target'} 
                            size={scaleIcon(28)} 
                            color={isSelected ? safeColors.white : theme.colors.primary} 
                          />
                        </View>
                        <View style={styles.templateInfo}>
                          <Text style={[styles.templateTitle, { color: theme.colors.onSurface }]}>
                            {template.title}
                          </Text>
                          <Text style={[styles.templateDescription, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                            {template.description}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <Icon name="check-circle" size={scaleIcon(24)} color={theme.colors.primary} />
                          </View>
                        )}
                      </View>
                      <View style={styles.templateMeta}>
                        <Badge 
                          variant={template.difficulty === 'easy' ? 'success' : template.difficulty === 'hard' ? 'error' : 'warning'} 
                          size="small"
                          style={styles.templateBadge}
                        >
                          {template.difficulty?.toUpperCase()}
                        </Badge>
                        <View style={styles.templateDurationContainer}>
                          <Icon name="calendar-clock" size={scaleIcon(14)} color={theme.colors.onSurfaceVariant} style={{ marginRight: scaleSize(6) }} />
                          <Text style={[styles.templateDuration, { color: theme.colors.onSurfaceVariant }]}>
                            {formatDuration(template.duration)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </>
        ) : (
          <>
            {/* Goal Input */}
            <Input
              label="Your Goal"
              placeholder="Enter your goal"
              value={goal}
              onChangeText={handleGoalChange}
              leftIcon="target"
              maxLength={100}
              showCounter
              error={goalError}
            />
          </>
        )}

        {/* Difficulty Selection - Only for custom mode */}
        {mode === 'custom' && (
          <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="gauge" size={scaleIcon(20)} color={theme.colors.primary} style={{ marginRight: scaleSize(8) }} />
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                  Difficulty
                </Text>
              </View>
            <View style={styles.difficultyContainer}>
              {difficulties.map((item) => {
                const isSelected = difficulty === item.value;
                const getDifficultyColor = () => {
                  if (item.value === 'easy') return '#10b981'; // Green
                  if (item.value === 'hard') return '#ef4444'; // Red
                  return theme.colors.primary; // Medium - primary color
                };
                const difficultyColor = getDifficultyColor();
                
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.difficultyButton,
                      {
                        borderWidth: 0,
                        backgroundColor: isSelected ? difficultyColor : theme.colors.surfaceVariant,
                      },
                      isSelected && {
                        transform: [{ scale: 1.02 }],
                        shadowColor: difficultyColor,
                      },
                    ]}
                    onPress={() => setDifficulty(item.value)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.difficultyIconContainer,
                      isSelected && { backgroundColor: safeColors.white + '33' }
                    ]}>
                      <Icon
                        name={item.icon}
                        size={scaleIcon(28)}
                        color={isSelected ? safeColors.white : difficultyColor}
                      />
                    </View>
                    <Text
                      style={[
                        styles.difficultyLabel,
                        {
                          color: isSelected ? safeColors.white : theme.colors.onSurface,
                          fontWeight: isSelected ? 'bold' : '600',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.difficultyDescription,
                        {
                          color: isSelected ? safeColors.white + 'E6' : theme.colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      {item.description}
                    </Text>
                    {isSelected && (
                      <View style={styles.difficultyCheck}>
                        <Icon name="check-circle" size={scaleIcon(20)} color={safeColors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Duration Selection - Only for custom mode */}
        {mode === 'custom' && (
          <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="calendar-range" size={scaleIcon(20)} color={theme.colors.primary} style={{ marginRight: scaleSize(8) }} />
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                  Duration
                </Text>
              </View>
            <View style={styles.durationContainer}>
              {durations.map((durationOption) => {
                const isSelected = duration === durationOption.days;
                return (
                  <TouchableOpacity
                    key={durationOption.days}
                    style={[
                      styles.durationButton,
                      {
                        borderWidth: 0,
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
                      },
                      isSelected && {
                        transform: [{ scale: 1.05 }],
                        shadowColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setDuration(durationOption.days)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.durationIconContainer,
                      isSelected && { backgroundColor: safeColors.white + '33' }
                    ]}>
                      <Icon 
                        name="calendar-check" 
                        size={scaleIcon(24)} 
                        color={isSelected ? safeColors.white : theme.colors.primary} 
                      />
                    </View>
                    <Text
                      style={[
                        styles.durationValue,
                        {
                          color: isSelected ? safeColors.white : theme.colors.onSurface,
                          fontWeight: 'bold',
                          fontSize: scaleFontSize(18),
                        },
                      ]}
                    >
                      {durationOption.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.durationCheck}>
                        <Icon name="check" size={scaleIcon(16)} color={safeColors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

          {/* Create Button - Stunning Gradient */}
          {(mode === 'template' && selectedTemplate) || (mode === 'custom' && goal.trim()) ? (
            <TouchableOpacity
              onPress={handleCreateChallenge}
              disabled={loading}
              style={[styles.createButtonContainer, loading && styles.createButtonDisabled]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary + 'DD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={safeColors.white} />
                ) : (
                  <>
                    <Icon name="rocket-launch" size={scaleIcon(24)} color={safeColors.white} style={{ marginRight: scaleSize(12) }} />
                    <Text style={styles.createButtonText}>Create Challenge</Text>
                    <Icon name="arrow-right" size={scaleIcon(20)} color={safeColors.white} style={{ marginLeft: scaleSize(12) }} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={[styles.createButtonContainer, styles.createButtonDisabled]}>
              <View style={[styles.createButtonGradient, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Icon 
                  name={mode === 'template' ? 'cursor-pointer' : 'pencil'} 
                  size={scaleIcon(20)} 
                  color={theme.colors.onSurfaceVariant} 
                  style={{ marginRight: scaleSize(12) }}
                />
                <Text style={[styles.createButtonText, { color: theme.colors.onSurfaceVariant }]}>
                  {mode === 'template' ? 'Select Challenge' : 'Enter Goal'}
                </Text>
              </View>
            </View>
          )}
        </Card>
        </Animated.View>
      </ScrollView>

      {/* Success Animation Modal */}
      <Modal
        visible={showSuccessAnimation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessAnimation(false)}
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successAnimationWrapper}>
            <LottieView
              ref={successAnimRef}
              source={require('../../assets/animations/successful.json')}
              autoPlay={false}
              loop={false}
              style={styles.successAnimation}
              speed={1.3}
            />
            <Text style={[styles.successText, { color: theme.colors.onSurface }]}>
              Challenge Created! 🎉
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    paddingBottom: scaleSize(24),
    borderBottomLeftRadius: scaleSize(32),
    borderBottomRightRadius: scaleSize(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(SCREEN_WIDTH * 0.053, 20),
  },
  backButton: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: scaleFontSize(28),
    fontWeight: 'bold',
    color: safeColors.white,
    marginBottom: scaleSize(4),
  },
  headerSubtitle: {
    fontSize: scaleFontSize(14),
    color: safeColors.white + 'E6',
    fontWeight: '500',
  },
  placeholder: {
    width: scaleSize(40),
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Math.max(SCREEN_WIDTH * 0.053, 20),
    paddingTop: scaleSize(24),
    paddingBottom: scaleSize(40),
  },
  modeContainer: {
    flexDirection: 'row',
    marginHorizontal: -scaleSize(6),
    marginBottom: scaleSize(24),
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaleSize(16),
    borderRadius: scaleSize(16),
    borderWidth: 0,
    marginHorizontal: scaleSize(6),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modeButtonActive: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modeIconContainer: {
    width: scaleSize(36),
    height: scaleSize(36),
    borderRadius: scaleSize(18),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize(8),
  },
  modeText: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
  },
  modeTextActive: {
    fontWeight: 'bold',
  },
  modeIndicator: {
    marginLeft: 'auto',
  },
  formCard: {
    borderRadius: scaleSize(24),
    padding: scaleSize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  section: {
    marginTop: scaleSize(24),
    marginBottom: scaleSize(8),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleSize(16),
  },
  sectionLabel: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginHorizontal: -scaleSize(6),
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleSize(12),
    paddingHorizontal: scaleSize(10),
    borderRadius: scaleSize(16),
    borderWidth: 0,
    marginHorizontal: scaleSize(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    minWidth: 0,
  },
  categoryIconContainer: {
    width: scaleSize(24),
    height: scaleSize(24),
    borderRadius: scaleSize(12),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize(6),
  },
  categoryText: {
    fontSize: scaleFontSize(14),
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'center',
  },
  categoryTextActive: {
    fontWeight: 'bold',
  },
  categoryCheck: {
    marginLeft: 'auto',
  },
  templatesList: {
    maxHeight: SCREEN_HEIGHT * 0.4,
  },
  templateCard: {
    padding: scaleSize(20),
    borderRadius: scaleSize(16),
    borderWidth: 0,
    marginBottom: scaleSize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  templateCardSelected: {
    borderWidth: 2,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  templateGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaleSize(16),
  },
  templateIconContainer: {
    width: scaleSize(56),
    height: scaleSize(56),
    borderRadius: scaleSize(16),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize(12),
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    marginBottom: scaleSize(6),
  },
  templateDescription: {
    fontSize: scaleFontSize(14),
    lineHeight: scaleFontSize(20),
  },
  selectedBadge: {
    marginLeft: 'auto',
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scaleSize(4),
  },
  templateBadge: {
    marginRight: scaleSize(8),
  },
  templateDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateDuration: {
    fontSize: scaleFontSize(12),
    fontWeight: '600',
  },
  difficultyContainer: {
    // Spacing handled by marginBottom in difficultyButton
  },
  difficultyButton: {
    borderRadius: scaleSize(20),
    borderWidth: 0,
    padding: scaleSize(20),
    alignItems: 'center',
    marginBottom: scaleSize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  difficultyIconContainer: {
    width: scaleSize(56),
    height: scaleSize(56),
    borderRadius: scaleSize(28),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleSize(12),
  },
  difficultyLabel: {
    fontSize: scaleFontSize(20),
    marginBottom: scaleSize(6),
  },
  difficultyDescription: {
    fontSize: scaleFontSize(13),
    textAlign: 'center',
  },
  difficultyCheck: {
    position: 'absolute',
    top: scaleSize(12),
    right: scaleSize(12),
  },
  durationContainer: {
    flexDirection: 'row',
    marginHorizontal: -scaleSize(6),
  },
  durationButton: {
    flex: 1,
    borderRadius: scaleSize(20),
    borderWidth: 0,
    paddingVertical: scaleSize(24),
    paddingHorizontal: scaleSize(12),
    alignItems: 'center',
    marginHorizontal: scaleSize(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  durationIconContainer: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleSize(8),
  },
  durationValue: {
    fontSize: scaleFontSize(36),
    marginBottom: scaleSize(4),
  },
  durationLabel: {
    fontSize: scaleFontSize(14),
    fontWeight: '600',
  },
  durationCheck: {
    position: 'absolute',
    top: scaleSize(8),
    right: scaleSize(8),
    width: scaleSize(24),
    height: scaleSize(24),
    borderRadius: scaleSize(12),
    backgroundColor: safeColors.white + '4D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonContainer: {
    marginTop: scaleSize(32),
    borderRadius: scaleSize(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleSize(18),
    paddingHorizontal: scaleSize(24),
  },
  createButtonText: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    color: safeColors.white,
  },
  // Success Animation Styles
  successModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimationWrapper: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: scaleSize(24),
    padding: scaleSize(32),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successAnimation: {
    width: scaleSize(200),
    height: scaleSize(200),
    marginBottom: scaleSize(16),
  },
  successText: {
    fontSize: scaleFontSize(20),
    fontWeight: '700',
    textAlign: 'center',
    marginTop: scaleSize(8),
  },
});

export default ChallengeCreationScreen;
