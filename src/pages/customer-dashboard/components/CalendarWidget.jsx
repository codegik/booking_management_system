import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarWidget = ({ bookings = [], onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)?.getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)?.getDay();
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const isSameDay = (date1, date2) => {
    return date1?.toDateString() === date2?.toDateString();
  };

  const hasBookingOnDate = (date) => {
    return bookings?.some(booking => 
      isSameDay(new Date(booking.date), date)
    );
  };

  const getBookingCountForDate = (date) => {
    return bookings?.filter(booking => 
      isSameDay(new Date(booking.date), date)
    )?.length;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(clickedDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days?.push(
        <div key={`empty-${i}`} className="h-10 w-10"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = isSameDay(date, today);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const hasBooking = hasBookingOnDate(date);
      const bookingCount = getBookingCountForDate(date);
      const isPast = date < today && !isToday;

      days?.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            relative h-10 w-10 rounded-lg text-sm font-medium transition-smooth
            ${isSelected 
              ? 'bg-primary text-primary-foreground shadow-soft' 
              : isToday
                ? 'bg-accent text-accent-foreground'
                : isPast
                  ? 'text-muted-foreground hover:bg-muted/50'
                  : 'text-foreground hover:bg-muted'
            }
            ${hasBooking ? 'ring-2 ring-success/30' : ''}
          `}
          disabled={isPast}
        >
          {day}
          {hasBooking && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {bookingCount > 9 ? '9+' : bookingCount}
              </span>
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Calendar</h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
            {formatDate(currentMonth)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
          <div key={day} className="h-8 flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Has Bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Today</span>
          </div>
        </div>
      </div>
      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <p className="text-sm font-medium text-foreground mb-1">
            {selectedDate?.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          {hasBookingOnDate(selectedDate) ? (
            <p className="text-xs text-success">
              {getBookingCountForDate(selectedDate)} booking(s) scheduled
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No bookings scheduled</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;