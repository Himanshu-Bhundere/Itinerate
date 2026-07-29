import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';
import { trackHomeEvent } from '../../lib/analytics';

// Common interface for all feed cards
export interface FeedItem {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  meta1?: string;
  meta2?: string;
  type?: 'plan' | 'destination' | 'creator';
  isSaved?: boolean;
}

interface Props {
  title: string;
  subtitle?: string;
  items: FeedItem[];
  onSave?: (id: string) => void;
  onViewAll?: () => void;
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop';

export default function FeedSection({ title, subtitle, items, onSave, onViewAll }: Props) {
  const router = useRouter();

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {onViewAll && (
          <TouchableOpacity 
            onPress={onViewAll} 
            accessibilityRole="button" 
            accessibilityLabel={`View all ${title}`}
          >
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => {
                trackHomeEvent('recommendation_opened', { item_id: item.id, title });
                if (item.type === 'destination') {
                  router.push(`/destination/${item.id}` as any);
                } else {
                  router.push(`/plans/${item.id}` as any);
                }
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.title}`}
            >
              <Image
                source={{ uri: item.image_url || DEFAULT_IMG }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                
                {(item.meta1 || item.meta2) && (
                  <View style={styles.cardMeta}>
                    {item.meta1 && (
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color={Colors.secondaryText} />
                        <Text style={styles.metaText}>{item.meta1}</Text>
                      </View>
                    )}
                    {item.meta1 && item.meta2 && <Text style={styles.metaDot}>•</Text>}
                    {item.meta2 && (
                      <View style={styles.metaItem}>
                        <Ionicons name="star" size={12} color="#FACC15" />
                        <Text style={styles.metaText}>{item.meta2}</Text>
                      </View>
                    )}
                  </View>
                )}

                {item.subtitle && (
                  <Text style={styles.subtitleText} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                )}
              </View>

              {onSave && (
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => onSave(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={item.isSaved ? 'Unsave item' : 'Save item'}
                >
                  <Ionicons
                    name={item.isSaved ? 'heart' : 'heart-outline'}
                    size={18}
                    color={item.isSaved ? Colors.danger : Colors.secondaryText}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  headerTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.headingS,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  viewAll: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.blue500,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
  },
  card: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardImage: {
    width: '100%',
    height: 110,
  },
  cardContent: {
    padding: Spacing.s,
    gap: 4,
  },
  cardTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
    lineHeight: 18,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  metaDot: {
    ...Typography.caption,
    color: Colors.divider,
  },
  subtitleText: {
    ...Typography.micro,
    color: Colors.secondaryText,
  },
  saveBtn: {
    position: 'absolute',
    top: Spacing.s,
    right: Spacing.s,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
