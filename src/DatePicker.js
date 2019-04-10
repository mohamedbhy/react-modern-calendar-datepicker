import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './DatePicker.css';

import Calendar from './Calendar';
import DatePickerInput from './DatePickerInput';

let shouldPreventFocus, mousePosition;

const DatePicker = ({
  isDayRange,
  selectedDay,
  onChange,
  formatInputText,
  inputPlaceholder,
  inputClassName,
  renderInput,
  selectedDayRange,
  wrapperClassName,
  calendarClassName,
  calendarTodayClassName,
  calendarSelectedDayClassName,
  calendarRangeStartClassName,
  calendarRangeBetweenClassName,
  calendarRangeEndClassName,
}) => {
  const calendarContainer = useRef(null);
  const dateInput = useRef(null);
  const [isCalendarOpen, setCalendarVisiblity] = useState(false);

  // get mouse live position
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, false);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, false);
    }
  }, []);
  useEffect(() => {
    const shouldCloseCalendar = !isDayRange ?
    !isCalendarOpen : (
      !isCalendarOpen &&
      selectedDayRange.from &&
      selectedDayRange.to
    );
    if (shouldCloseCalendar) dateInput.current.blur();
  }, [selectedDay, isCalendarOpen]);

  const toggleCalendar = () => setCalendarVisiblity(!isCalendarOpen);

  // keep calendar open if clicked inside the calendar
  const handleBlur = e => {
    e.persist();
    const { current: calendar } = calendarContainer;
    if (!calendar) return;
    const calendarPosition = calendar.getBoundingClientRect();
    const isInBetween = (value, start, end) => (value >= start) && (value <= end);
    const isInsideCalendar = isInBetween(mousePosition.x, calendarPosition.left, calendarPosition.right) &&
      isInBetween(mousePosition.y, calendarPosition.top, calendarPosition.bottom);
    if (isInsideCalendar) {
      shouldPreventFocus = true;
      e.target.focus();
      shouldPreventFocus = false;
      return;
    }
    toggleCalendar();
  };

  const handleFocus = () => {
    if (shouldPreventFocus) return;
    toggleCalendar();
  };

  const handleMouseMove = e => {
    const { clientX: x, clientY: y } = e;
    mousePosition = { x, y };
  };

  const handleDaySelect = day => {
    onChange(day);
    toggleCalendar();
  };

  const handleDayRangeSelect = range => {
    onChange(range);
    if (range.from && range.to) toggleCalendar();
  };

  return (
    <div className={`DatePicker ${wrapperClassName}`}>
      {isCalendarOpen && (
        <div
          ref={calendarContainer}
          className="DatePicker__calendarContainer"
        >
          <Calendar
            onDaySelect={handleDaySelect}
            selectedDay={selectedDay}
            onChange={isDayRange ? handleDayRangeSelect : handleDaySelect}
            selectedDayRange={selectedDayRange}
            onDayRangeSelect={handleDayRangeSelect}
            isDayRange={isDayRange}
            calendarClassName={calendarClassName}
            calendarTodayClassName={calendarTodayClassName}
            calendarSelectedDayClassName={calendarSelectedDayClassName}
            calendarRangeStartClassName={calendarRangeStartClassName}
            calendarRangeBetweenClassName={calendarRangeBetweenClassName}
            calendarRangeEndClassName={calendarRangeEndClassName}
          />
        </div>
      )}
      <DatePickerInput
        ref={dateInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        formatInputText={formatInputText}
        selectedDay={selectedDay}
        selectedDayRange={selectedDayRange}
        inputPlaceholder={inputPlaceholder}
        inputClassName={inputClassName}
        renderInput={renderInput}
        isDayRange={isDayRange}
      />
    </div>
  );
};

DatePicker.defaultProps = {
  isDayRange: false,
  selectedDay: null,
  wrapperClassName: '',
};

DatePicker.propTypes = {
  wrapperClassName: PropTypes.string,
};

export default DatePicker;