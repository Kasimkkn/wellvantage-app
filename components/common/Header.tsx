import { COLORS, } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    title: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    backgroundColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    backgroundColor = COLORS.primary,
}) => {
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    {leftIcon && onLeftPress && (
                        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                            <Ionicons name={leftIcon} size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.title}>{title}</Text>

                <View style={styles.rightContainer}>
                    {rightIcon && onRightPress && (
                        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                            <Ionicons name={rightIcon} size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: COLORS.primary,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    leftContainer: {
        width: 40,
        alignItems: 'flex-start',
    },
    rightContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    iconButton: {
        padding: SPACING.xs,
    },
    title: {
        flex: 1,
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.white,
        textAlign: 'center',
    },
});