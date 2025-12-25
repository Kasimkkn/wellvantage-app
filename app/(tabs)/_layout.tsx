import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { WorkoutProvider } from '@/context/WorkoutContext';
import Availability from '@/screens/Availability';
import BookSlot from '@/screens/BookSlot';
import Client from '@/screens/Client';
import Workout from '@/screens/Workout';
import React, { useState } from 'react';
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'Workout' | 'Client' | 'Availability' | 'Book';

const RootLayout = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Workout');

  const renderContent = () => {
    switch (activeTab) {
      case 'Workout':
        return <Workout />;
      case 'Client':
        return <Client />;
      case 'Availability':
        return <Availability />;
      case 'Book':
        return <BookSlot />;
      default:
        return <Workout />;
    }
  };

  return (
    <WorkoutProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Management</Text>
        </View>

        <View style={styles.tabs}>
          {(['Workout', 'Client', 'Availability', 'Book'] as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'Book' ? 'Book Slots' : tab}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.content}>{renderContent()}</View>
      </SafeAreaView>
    </WorkoutProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : SPACING.md,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
  },
});