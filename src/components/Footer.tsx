import React from 'react';
import dayjs from 'dayjs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCalendarContext } from '../CalendarContext';

export const Footer = () => {
  const {
    mode,
    date,
    calendarView,
    setCalendarView,
    theme,
    confirmTimeText,
    timeText = 'Time',
    timePicker,
  } = useCalendarContext();

  return timePicker && mode === 'single' && calendarView !== 'year' ? (
    <Pressable
      onPress={() => setCalendarView(calendarView === 'time' ? 'day' : 'time')}
      accessibilityRole="button"
      accessibilityLabel={dayjs(date).format('HH:mm')}
    >
      <View style={styles.footerContainer}>
        <Text style={styles.text}>{timeText}</Text>
        <View
          style={[
            styles.textContainer,
            theme?.footerTimeContainerStyle,
          ]}
        >
          <Text
            style={[
              styles.text,
              theme?.footerTimeTextStyle,
            ]}
          >
            {calendarView === 'time' && confirmTimeText
              ? confirmTimeText
              : dayjs(date).format('HH:mm')}
          </Text>
        </View>
      </View>
    </Pressable>
  ) : null;
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    marginHorizontal: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
