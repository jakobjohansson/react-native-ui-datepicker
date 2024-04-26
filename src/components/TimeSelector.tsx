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

const TimeSelector = () => {
  const { date, onSelectDate, theme } = useCalendarContext();
  const { hour, minute } = getParsedDate(date);

  const handleChangeHour = useCallback(
    (value: number) => {
      const newDate = getDate(date).hour(value);
      onSelectDate(getFormated(newDate));
    },
    [date, onSelectDate]
  );

  const handleChangeMinute = useCallback(
    (value: number) => {
      const newDate = getDate(date).minute(value);
      onSelectDate(getFormated(newDate));
    },
    [date, onSelectDate]
  );

  return (
    <View style={styles.container} testID="time-selector">
      <View
        style={[styles.timePickerContainer, theme?.timePickerContainerStyle]}
      >
        <View style={styles.wheelContainer}>
          <WheelPicker
            selectedIndex={hours.findIndex((hr) => hr === hour)}
            options={hours.map((hr) => `${hr}`.padStart(2, '0'))}
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
            selectedIndex={minutes.findIndex((m) => m === minute)}
            options={minutes.map((m) => `${m}`.padStart(2, '0'))}
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
