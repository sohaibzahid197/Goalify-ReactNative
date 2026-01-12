/**
 * Challenge Creation Screen
 * Allows users to create a new challenge
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Dimensions, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Input, Button, Card, Badge } from '../components';
import { useChallenge } from '../hooks/useChallenge';
import { validateGoal } from '../utils/validation';
import { getAllChallengeTemplates, getChallengesByCategory } from '../data/challengeTemplates';
import { GRADIENTS } from '../assets/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling function
const scaleFontSize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Base width (iPhone X)
  return Math.max(12, Math.min(size * scale, size * 1.3));
};

const scaleSize = (size) => {
  const scale = SCREEN_WIDTH / 375;
  return size * scale;
};

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
  
  const templates = getChallengesByCategory(category);
  
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
    { value: 'easy', label: 'Easy', description: 'Perfect for beginners', icon: 'speedometer-slow' },
    { value: 'medium', label: 'Medium', description: 'Balanced challenge', icon: 'speedometer-medium' },
    { value: 'hard', label: 'Hard', description: 'Push your limits', icon: 'speedometer' },
  ];

  const durations = [7, 14, 30];

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
        challenge = await createChallenge({
          templateId: selectedTemplate.id,
        });
      } else {
        // Create custom challenge
        const validation = validateGoal(goal);
        if (!validation.isValid) {
          setGoalError(validation.error);
          Alert.alert('Validation Error', validation.error);
          setLoading(false);
          return;
        }
        
        challenge = await createChallenge({
          goal: validation.value,
          difficulty,
          duration,
          category,
        });
      }
      
      Alert.alert(
        'Success! 🎉',
        'Your challenge has been created!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
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
            style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Create Challenge</Text>
            <Text style={styles.headerSubtitle}>Start your journey to success! 🚀</Text>
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
                mode === 'template' && styles.modeButtonActive,
                mode === 'template' && { 
                  backgroundColor: theme.colors.primary,
                  shadowColor: theme.colors.primary,
                },
              ]}
              onPress={() => setMode('template')}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIconContainer, mode === 'template' && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Icon 
                  name="format-list-bulleted" 
                  size={scaleSize(22)} 
                  color={mode === 'template' ? '#FFFFFF' : theme.colors.onSurfaceVariant} 
                />
              </View>
              <Text style={[
                styles.modeText, 
                { color: mode === 'template' ? '#FFFFFF' : theme.colors.onSurfaceVariant },
                mode === 'template' && styles.modeTextActive
              ]}>
                Templates
              </Text>
              {mode === 'template' && (
                <View style={styles.modeIndicator}>
                  <Icon name="check-circle" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'custom' && styles.modeButtonActive,
                mode === 'custom' && { 
                  backgroundColor: theme.colors.primary,
                  shadowColor: theme.colors.primary,
                },
              ]}
              onPress={() => setMode('custom')}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIconContainer, mode === 'custom' && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Icon 
                  name="pencil" 
                  size={scaleSize(22)} 
                  color={mode === 'custom' ? '#FFFFFF' : theme.colors.onSurfaceVariant} 
                />
              </View>
              <Text style={[
                styles.modeText, 
                { color: mode === 'custom' ? '#FFFFFF' : theme.colors.onSurfaceVariant },
                mode === 'custom' && styles.modeTextActive
              ]}>
                Custom
              </Text>
              {mode === 'custom' && (
                <View style={styles.modeIndicator}>
                  <Icon name="check-circle" size={16} color="#FFFFFF" />
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
                <Icon name="apps" size={scaleSize(20)} color={theme.colors.primary} />
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                  Choose Category
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
                        isSelected && {
                          backgroundColor: categoryColor,
                          borderColor: categoryColor,
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
                        isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }
                      ]}>
                        <Icon 
                          name={getCategoryIcon(cat)} 
                          size={scaleSize(24)} 
                          color={isSelected ? '#FFFFFF' : categoryColor} 
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryText,
                          { color: isSelected ? '#FFFFFF' : theme.colors.onSurface },
                          isSelected && styles.categoryTextActive
                        ]}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                      {isSelected && (
                        <View style={styles.categoryCheck}>
                          <Icon name="check" size={16} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Template Selection - Stunning Cards */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="star" size={scaleSize(20)} color={theme.colors.warning || '#FF9800'} />
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                  Select Challenge
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
                        isSelected && styles.templateCardSelected,
                        isSelected && {
                          borderColor: theme.colors.primary,
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
                            size={scaleSize(28)} 
                            color={isSelected ? '#FFFFFF' : theme.colors.primary} 
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
                            <Icon name="check-circle" size={24} color={theme.colors.primary} />
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
                          <Icon name="calendar-clock" size={14} color={theme.colors.onSurfaceVariant} />
                          <Text style={[styles.templateDuration, { color: theme.colors.onSurfaceVariant }]}>
                            {template.duration} days
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
              label="What's your goal?"
              placeholder="e.g., Run 5km daily, Learn Spanish, Read 30 minutes"
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
              <Icon name="gauge" size={scaleSize(20)} color={theme.colors.primary} />
              <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                Difficulty Level
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
                      isSelected && {
                        backgroundColor: difficultyColor,
                        borderColor: difficultyColor,
                        transform: [{ scale: 1.02 }],
                        shadowColor: difficultyColor,
                      },
                      !isSelected && {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outline,
                      },
                    ]}
                    onPress={() => setDifficulty(item.value)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.difficultyIconContainer,
                      isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }
                    ]}>
                      <Icon
                        name={item.icon}
                        size={scaleSize(28)}
                        color={isSelected ? '#FFFFFF' : difficultyColor}
                      />
                    </View>
                    <Text
                      style={[
                        styles.difficultyLabel,
                        {
                          color: isSelected ? '#FFFFFF' : theme.colors.onSurface,
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
                          color: isSelected ? 'rgba(255,255,255,0.9)' : theme.colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      {item.description}
                    </Text>
                    {isSelected && (
                      <View style={styles.difficultyCheck}>
                        <Icon name="check-circle" size={20} color="#FFFFFF" />
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
              <Icon name="calendar-range" size={scaleSize(20)} color={theme.colors.primary} />
              <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>
                Challenge Duration
              </Text>
            </View>
            <View style={styles.durationContainer}>
              {durations.map((days) => {
                const isSelected = duration === days;
                return (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.durationButton,
                      isSelected && {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                        transform: [{ scale: 1.05 }],
                        shadowColor: theme.colors.primary,
                      },
                      !isSelected && {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outline,
                      },
                    ]}
                    onPress={() => setDuration(days)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.durationIconContainer,
                      isSelected && { backgroundColor: 'rgba(255,255,255,0.2)' }
                    ]}>
                      <Icon 
                        name="calendar-check" 
                        size={scaleSize(24)} 
                        color={isSelected ? '#FFFFFF' : theme.colors.primary} 
                      />
                    </View>
                    <Text
                      style={[
                        styles.durationValue,
                        {
                          color: isSelected ? '#FFFFFF' : theme.colors.onSurface,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      {days}
                    </Text>
                    <Text
                      style={[
                        styles.durationLabel,
                        {
                          color: isSelected ? 'rgba(255,255,255,0.9)' : theme.colors.onSurfaceVariant,
                        },
                      ]}
                    >
                      {days === 1 ? 'day' : 'days'}
                    </Text>
                    {isSelected && (
                      <View style={styles.durationCheck}>
                        <Icon name="check" size={16} color="#FFFFFF" />
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
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="rocket-launch" size={scaleSize(24)} color="#FFFFFF" />
                    <Text style={styles.createButtonText}>Create Challenge</Text>
                    <Icon name="arrow-right" size={scaleSize(20)} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={[styles.createButtonContainer, styles.createButtonDisabled]}>
              <View style={[styles.createButtonGradient, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Icon 
                  name={mode === 'template' ? 'cursor-pointer' : 'pencil'} 
                  size={scaleSize(20)} 
                  color={theme.colors.onSurfaceVariant} 
                />
                <Text style={[styles.createButtonText, { color: theme.colors.onSurfaceVariant }]}>
                  {mode === 'template' ? 'Select a Challenge' : 'Enter Your Goal'}
                </Text>
              </View>
            </View>
          )}
        </Card>
        </Animated.View>
      </ScrollView>
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
    color: '#FFFFFF',
    marginBottom: scaleSize(4),
  },
  headerSubtitle: {
    fontSize: scaleFontSize(14),
    color: 'rgba(255,255,255,0.9)',
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
    gap: scaleSize(12),
    marginBottom: scaleSize(24),
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaleSize(16),
    borderRadius: scaleSize(16),
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    gap: scaleSize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  section: {
    marginTop: scaleSize(28),
    marginBottom: scaleSize(8),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(8),
    marginBottom: scaleSize(16),
  },
  sectionLabel: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: scaleSize(12),
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaleSize(16),
    borderRadius: scaleSize(16),
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    gap: scaleSize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: scaleSize(32),
    height: scaleSize(32),
    borderRadius: scaleSize(16),
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: scaleFontSize(14),
    fontWeight: '600',
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
    borderRadius: scaleSize(20),
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: scaleSize(16),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  templateCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
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
    gap: scaleSize(12),
  },
  templateIconContainer: {
    width: scaleSize(56),
    height: scaleSize(56),
    borderRadius: scaleSize(16),
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  templateBadge: {
    marginRight: scaleSize(8),
  },
  templateDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(6),
  },
  templateDuration: {
    fontSize: scaleFontSize(12),
    fontWeight: '600',
  },
  difficultyContainer: {
    gap: scaleSize(16),
  },
  difficultyButton: {
    borderRadius: scaleSize(20),
    borderWidth: 2,
    padding: scaleSize(20),
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  difficultyIconContainer: {
    width: scaleSize(56),
    height: scaleSize(56),
    borderRadius: scaleSize(28),
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    gap: scaleSize(12),
  },
  durationButton: {
    flex: 1,
    borderRadius: scaleSize(20),
    borderWidth: 2,
    paddingVertical: scaleSize(24),
    paddingHorizontal: scaleSize(12),
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  durationIconContainer: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    gap: scaleSize(12),
  },
  createButtonText: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ChallengeCreationScreen;
