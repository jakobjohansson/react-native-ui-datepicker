import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useCalendarContext } from '../CalendarContext';
import { CALENDAR_HEIGHT } from '../enums';
import { getParsedDate, getDate, getFormated } from '../utils';
import WheelPicker from 'react-native-wheely';

function createNumberList(num: number) {
  return new Array(num).fill(0).map((_, index) => index);
}

const hours = createNumberList(24);
const minutes = createNumberList(60);
const formattedHours = hours.map((hr) => `${hr}`.padStart(2, '0'))
const formattedMinutes = minutes.map((m) => `${m}`.padStart(2, '0'))

const TimeSelector = () => {
  const { date, onSelectDate, theme, minDate } = useCalendarContext();
  const { hour, minute } = getParsedDate(date);
  const selectedHour = hours.findIndex((hr) => hr === hour);
  const selectedMinute = minutes.findIndex((m) => m === minute);

  const handleChangeHour = useCallback(
    (value: number) => {
      const newDate = getDate(date).hour(value);

      if (minDate && newDate.isBefore(minDate)) {
        onSelectDate(getFormated(minDate));
        return;
      }

      onSelectDate(getFormated(newDate));
    },
    [date, onSelectDate, minDate]
  );

  const handleChangeMinute = useCallback(
    (value: number) => {
      const newDate = getDate(date).minute(value);

      if (minDate && newDate.isBefore(minDate)) {
        onSelectDate(getFormated(minDate));
        return;
      }

      onSelectDate(getFormated(newDate));
    },
    [date, onSelectDate, minDate]
  );

  return (
    <View style={styles.container} testID="time-selector">
      <View
        style={[styles.timePickerContainer, theme?.timePickerContainerStyle]}
      >
        <View style={styles.wheelContainer}>
          <WheelPicker
            selectedIndex={selectedHour}
            options={formattedHours}
            itemTextStyle={{
              ...styles.timePickerText,
              ...theme?.timePickerTextStyle,
            }}
            onChange={handleChangeHour}
          />
        </View>
        <Text
          style={{
            ...styles.timePickerText,
            ...theme?.timePickerTextStyle,
          }}
        >
          :
        </Text>
        <View style={styles.wheelContainer}>
          <WheelPicker
            selectedIndex={selectedMinute}
            options={formattedMinutes}
            itemTextStyle={{
              ...styles.timePickerText,
              ...theme?.timePickerTextStyle,
            }}
            onChange={handleChangeMinute}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    flex: 1,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: CALENDAR_HEIGHT / 2,
    height: CALENDAR_HEIGHT / 2,
  },
  timePickerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TimeSelector;
