import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/constants/spacing';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CalendarPickerProps {
    selectedDate?: string;
    onDateSelect: (date: string) => void;
    markedDates?: { [key: string]: any };
    minDate?: string;
    maxDate?: string;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
    selectedDate,
    onDateSelect,
    markedDates = {},
    minDate,
    maxDate,
}) => {
    const [currentMonth, setCurrentMonth] = useState(
        selectedDate || new Date().toISOString().split('T')[0]
    );

    const marked = {
        ...markedDates,
        ...(selectedDate && {
            [selectedDate]: {
                selected: true,
                selectedColor: COLORS.primary,
                ...markedDates[selectedDate],
            },
        }),
    };

    return (
        <View style={styles.container}>
            <Calendar
                current={currentMonth}
                onDayPress={(day) => onDateSelect(day.dateString)}
                markedDates={marked}
                minDate={minDate}
                maxDate={maxDate}
                theme={{
                    backgroundColor: COLORS.white,
                    calendarBackground: COLORS.white,
                    textSectionTitleColor: COLORS.text.secondary,
                    selectedDayBackgroundColor: COLORS.primary,
                    selectedDayTextColor: COLORS.white,
                    todayTextColor: COLORS.primary,
                    dayTextColor: COLORS.text.primary,
                    textDisabledColor: COLORS.gray[300],
                    dotColor: COLORS.primary,
                    selectedDotColor: COLORS.white,
                    arrowColor: COLORS.primary,
                    monthTextColor: COLORS.text.primary,
                    indicatorColor: COLORS.primary,
                    textDayFontFamily: 'System',
                    textMonthFontFamily: 'System',
                    textDayHeaderFontFamily: 'System',
                    textDayFontWeight: '400',
                    textMonthFontWeight: '600',
                    textDayHeaderFontWeight: '600',
                    textDayFontSize: FONT_SIZES.md,
                    textMonthFontSize: FONT_SIZES.lg,
                    textDayHeaderFontSize: FONT_SIZES.sm,
                }}
                onMonthChange={(month) => {
                    setCurrentMonth(month.dateString);
                }}
                enableSwipeMonths={true}
                style={styles.calendar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },
    calendar: {
        borderRadius: BORDER_RADIUS.lg,
    },
});