import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { SuggestedItinerary } from '../../constants/destinationTypes';

interface SuggestedItinerariesListProps {
  itineraries: SuggestedItinerary[];
  onPressItinerary: (id: string) => void;
  onSaveItinerary: (id: string) => void;
}

export default function SuggestedItinerariesList({
  itineraries,
  onPressItinerary,
  onSaveItinerary,
}: SuggestedItinerariesListProps) {
  if (!itineraries.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Suggested Itineraries</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={280 + Spacing.m}
        decelerationRate="fast"
      >
        {itineraries.map((itinerary) => (
          <Pressable 
            key={itinerary.id}
            style={styles.card}
            onPress={() => onPressItinerary(itinerary.id)}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: itinerary.imageUrl }} style={styles.image} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {itinerary.category.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <Pressable 
                style={styles.saveButton}
                onPress={() => onSaveItinerary(itinerary.id)}
              >
                <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
              </Pressable>
            </View>

            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {itinerary.title}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.secondaryText} />
                  <Text style={styles.metaText}>{itinerary.durationDays} Days</Text>
                </View>
                <Text style={styles.metaDivider}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="cash-outline" size={14} color={Colors.secondaryText} />
                  <Text style={styles.metaText}>${itinerary.estimatedCost}</Text>
                </View>
              </View>

              <View style={styles.footer}>
                <View style={styles.creatorInfo}>
                  {itinerary.creatorAvatar ? (
                    <Image source={{ uri: itinerary.creatorAvatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={12} color={Colors.white} />
                    </View>
                  )}
                  <Text style={styles.creatorName}>By {itinerary.creatorName}</Text>
                </View>
                <View style={[
                  styles.difficultyBadge,
                  itinerary.difficulty === 'easy' && { backgroundColor: Colors.success + '20' },
                  itinerary.difficulty === 'moderate' && { backgroundColor: Colors.warning + '20' },
                  itinerary.difficulty === 'hard' && { backgroundColor: Colors.danger + '20' },
                ]}>
                  <Text style={[
                    styles.difficultyText,
                    itinerary.difficulty === 'easy' && { color: Colors.success },
                    itinerary.difficulty === 'moderate' && { color: '#B45309' }, // Darker warning for text readability
                    itinerary.difficulty === 'hard' && { color: Colors.danger },
                  ]}>
                    {itinerary.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.m,
  },
  sectionTitle: {
    ...Typography.headingM,
    color: Colors.primaryText,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  scrollContent: {
    paddingHorizontal: Spacing.m,
    gap: Spacing.m,
  },
  card: {
    width: 280,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.l,
    overflow: 'hidden',
    ...Shadows.card,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.s,
    left: Spacing.s,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.s,
  },
  categoryText: {
    ...Typography.micro,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  saveButton: {
    position: 'absolute',
    top: Spacing.s,
    right: Spacing.s,
    width: 32,
    height: 32,
    borderRadius: Radius.circular,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.m,
  },
  title: {
    ...Typography.headingS,
    color: Colors.primaryText,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    marginBottom: Spacing.m,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
  },
  metaDivider: {
    color: Colors.divider,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.m,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: Radius.circular,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.placeholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorName: {
    ...Typography.caption,
    color: Colors.secondaryText,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  difficultyText: {
    ...Typography.micro,
    fontWeight: '700',
  },
});
