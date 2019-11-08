import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';

import * as strings from 'ModernCalendarWebPartStrings';
import ModernCalendar from './components/ModernCalendar';
import { IModernCalendarProps } from './components/IModernCalendarProps';

import { SPComponentLoader } from '@microsoft/sp-loader';
import * as jquery from "jquery";
import './jalendar/jalendar.min';

export interface IModernCalendarWebPartProps {
  title: string;
  absoluteUrl: string;
  events: any;
}

export default class ModernCalendarWebPart extends BaseClientSideWebPart<IModernCalendarWebPartProps> {

  private listResult;
  private listInit = false;
  private jalendarInit = false;

  public onInit<T>(): Promise<T> {
    let lastDays = new Date();
    lastDays.setTime(lastDays.valueOf() - 30 * 24 * 60 * 60 * 1000);
    let nextDays = new Date();
    nextDays.setTime(nextDays.valueOf() + 365 * 24 * 60 * 60 * 1000);
    let query = '';
    query += '$filter=(EventDate gt \''+lastDays.toISOString()+'\') and (EndDate lt \''+nextDays.toISOString()+'\')&';
    query += '$top=100&';
    query += '$orderby=EventDate asc';
    this._getListData(query).then((response) => {
      this.listResult = response.value;
      this.listInit = true;
      this.render();
    });
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IModernCalendarProps > = React.createElement(
      ModernCalendar,
      {
        title: this.properties.title,
        absoluteUrl: this.context.pageContext.site.absoluteUrl,
        events: this.listResult
      }
    );
    if(this.listInit){
      ReactDom.render(element, this.domElement);
      if(!this.jalendarInit){
        require('./jalendar/jalendar.min.css');
        jquery('#calendar').jalendar({
            color: window["__themeState__"].theme.bodyFrameBackground,
            titleColor: window["__themeState__"].theme.themePrimary,
            weekColor: window["__themeState__"].theme.themeDarkAlt,
            todayColor: window["__themeState__"].theme.themePrimary,
            lang: 'EN',
        });
        this.jalendarInit = true;
      }
    }

  }

  private _getListData(query:string): Promise<any> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/Lists/GetByTitle('Events')/Items?` + query, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
