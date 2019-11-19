import * as React from 'react';
import styles from './ModernCalendar.module.scss';
import { IModernCalendarProps } from './IModernCalendarProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IFrameDialog } from "@pnp/spfx-controls-react/lib/IFrameDialog";

export default class ModernCalendar extends React.Component<IModernCalendarProps, {}> {
  
  private openNewEvent = () => {
    window.open( this.props.absoluteUrl + '/Lists/Events/NewForm.aspx?source='+this.props.absoluteUrl);
  }
  private items:any;

  public render(): React.ReactElement<IModernCalendarProps> {
    //console.info(this.props.events);
    this.items = this.props.events.map((item, key) => {
      if(item) {
        var d1 = item.EventDate ? item.EventDate.split('T')[0] : null;
        var d2 = d1 ? d1.split('-')[0] : null;
        var d3 = d1 ? d1.split('-')[1] : null;
        var d4 = d1 ? d1.split('-')[2] : null;
        var d5 = d4+'-'+d3+'-'+d2;
        var url = '';
        if(item.EventPage){
          url = item.EventPage;
        } else {
          url = this.props.absoluteUrl + '/_layouts/15/Event.aspx?ListGuid='+item["odata.editLink"].split("'")[1]+'&ItemId='+item.Id;
        }
        return <div className="added-event" data-date={d5} data-title={item.Title} data-link={url} data-type="event"></div>;
      }}
    );
    return (
      <div id="miniCalendar" className={styles.modernCalendar}>
        <div className={styles.wptitle}>
          <Icon iconName='Calendar' className={styles.wptitleIcon} />
          <span>{this.props.title}</span>
          <div className={styles.addEventContainer} title="Add new event" onClick={this.openNewEvent}>
            <Icon iconName='AddEvent' id="addEventButton" className={styles.wptitleIcon} />
          </div>
        </div>
        <div id="calendar" className="jalendar">
          {this.items}
        </div>
      </div>
    );
  }
}
