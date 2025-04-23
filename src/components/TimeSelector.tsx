import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useCalendarContext } from '../CalendarContext';
import { CALENDAR_HEIGHT } from '../enums';
import { getParsedDate, getDate, getFormated } from '../utils';
import WheelPicker from 'react-native-wheely';

function createNumberList(num: number, interval = 1) {
  return new Array(num / interval).fill(0).map((_, index) => index * interval);
}

const hours = createNumberList(24);

const TimeSelector = () => {
  const [forceHourRerender, setForceHourRerender] = React.useState(false);
  const [forceMinuteRerender, setForceMinuteRerender] = React.useState(false);
  const { date, onSelectDate, theme, minDate, minuteInterval } =
    useCalendarContext();
  const minutes = React.useMemo(
    () => createNumberList(60, minuteInterval),
    [minuteInterval]
  );
  const formattedHours = hours.map((hr) => `${hr}`.padStart(2, '0'));
  const formattedMinutes = minutes.map((m) => `${m}`.padStart(2, '0'));
  const { hour, minute } = getParsedDate(date);
  const selectedHour = hours.findIndex((hr) => hr === hour);

  // Get the closest index of the selected minute
  const selectedMinute = minutes.reduce((acc, mn, index) => {
    if (mn === minute) {
      return index;
    }

    const accMinutes = minutes[acc];

    if (accMinutes == null) {
      return index;
    }

    const diff = Math.abs(mn - accMinutes);

    if (diff < Math.abs(minute - accMinutes)) {
      return index;
    }

    return acc;
  }, 0);

  const handleChangeHour = useCallback(
    (value: number) => {
      const hr = hours[value];

      if (hr == null) {
        return;
      }

      const newDate = getDate(date).hour(hr);

      if (minDate && newDate.isBefore(minDate)) {
        onSelectDate(getFormated(minDate));
        setForceHourRerender((f) => !f);
        setForceMinuteRerender((f) => !f);
        return;
      }

      onSelectDate(getFormated(newDate));
    },
    [date, onSelectDate, minDate]
  );

  const handleChangeMinute = useCallback(
    (value: number) => {
      const mn = minutes[value];

      if (mn == null) {
        return;
      }

      const newDate = getDate(date).minute(mn);

      if (minDate && newDate.isBefore(minDate)) {
        onSelectDate(getFormated(minDate));
        setForceMinuteRerender((f) => !f);
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
            key={forceHourRerender ? 'force-hour' : 'rerender-hour'}
            selectedIndex={selectedHour}
            options={formattedHours}
            selectedIndicatorStyle={theme?.selectedTimeIndicatorStyle}
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
            key={forceMinuteRerender ? 'force-minute' : 'rerender-minute'}
            selectedIndex={selectedMinute}
            options={formattedMinutes}
            selectedIndicatorStyle={theme?.selectedTimeIndicatorStyle}
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
