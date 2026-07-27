import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { SeasonalInfo } from '../../constants/destinationTypes';

interface SeasonalGuideProps {
  seasonalData: SeasonalInfo[];
}

export default function SeasonalGuide({ seasonalData }: SeasonalGuideProps) {
  const [activeSeason, setActiveSeason] = useState<SeasonalInfo['season']>(
    seasonalData[0]?.season || 'summer'
  );

  const activeData = seasonalData.find(s => s.season === activeSeason);

  const getSeasonIcon = (season: SeasonalInfo['season']) => {
    switch (season) {
      case 'summer': return 'sunny';
      case 'winter': return 'snow';
      case 'monsoon': return 'rainy';
      case 'autumn': return 'leaf';
      case 'spring': return 'flower';
    }
  };

  if (!seasonalData.length || !activeData) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Seasonal Guide</Text>
      
      {/* Season Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorContainer}
      >
        {seasonalData.map((data) => {
          const isActive = data.season === activeSeason;
          return (
            <Pressable
              key={data.season}
              style={[styles.seasonPill, isActive && styles.seasonPillActive]}
              onPress={() => setActiveSeason(data.season)}
            >
              <Ionicons 
                name={getSeasonIcon(data.season)} 
                size={16} 
                color={isActive ? Colors.white : Colors.secondaryText} 
              />
              <Text style={[styles.seasonPillText, isActive && styles.seasonPillTextActive]}>
                {data.season.charAt(0).toUpperCase() + data.season.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Season Content */}
      <View style={styles.contentCard}>
        <View style={styles.prosConsContainer}>
          <View style={styles.column}>
            <View style={styles.columnHeader}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.columnTitle}>Why Go</Text>
            </View>
            {activeData.advantages.map((adv, idx) => (
              <Text key={idx} style={styles.listItem}>• {adv}</Text>
            ))}
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.column}>
            <View style={styles.columnHeader}>
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
              <Text style={styles.columnTitle}>Good to Know</Text>
            </View>
            {activeData.disadvantages.map((dis, idx) => (
              <Text key={idx} style={styles.listItem}>• {dis}</Text>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subTitle}>Top Activities</Text>
        <View style={styles.tagContainer}>
          {activeData.recommendedActivities.map((activity, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{activity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.subTitle}>Packing List</Text>
        <Text style={styles.packingText}>
          {activeData.packingTips.join(', ')}
        </Text>
      </View>
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
  selectorContainer: {
    paddingHorizontal: Spacing.m,
    gap: Spacing.s,
    marginBottom: Spacing.m,
  },
  seasonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  seasonPillActive: {
    backgroundColor: Colors.blue500,
    borderColor: Colors.blue500,
  },
  seasonPillText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  seasonPillTextActive: {
    color: Colors.white,
  },
  contentCard: {
    marginHorizontal: Spacing.m,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.l,
    padding: Spacing.m,
    ...Shadows.card,
  },
  prosConsContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.s,
  },
  columnTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.m,
  },
  listItem: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.m,
  },
  subTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: Spacing.s,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  tag: {
    backgroundColor: Colors.blue50,
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: Radius.s,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.blue700,
    fontWeight: '500',
  },
  packingText: {
    ...Typography.bodySmall,
    color: Colors.secondaryText,
    lineHeight: 20,
  },
});
