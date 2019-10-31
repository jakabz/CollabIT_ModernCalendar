import * as React from 'react';
import styles from './ModernCalendar.module.scss';
import { IModernCalendarProps } from './IModernCalendarProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import Calendar from 'react-calendar';

export default class ModernCalendar extends React.Component<IModernCalendarProps, {}> {

  public events = ({ date, view }) => view === 'month' && date.getDay() === 0 ? <p>It's Sunday!</p> : null;
  public today = new Date();

  public render(): React.ReactElement<IModernCalendarProps> {
    
    return (
      <Calendar 
        className={styles.modernCalendar}
        tileContent={this.events}
        value={this.today}
        calendarType="ISO 8601"
      />
    );
  }
}
