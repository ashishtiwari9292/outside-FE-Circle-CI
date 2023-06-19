import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeElapsed',
})
export class TimeElapsedPipe implements PipeTransform {
  transform(value: string, ...args: string[]): string {
    // let offset = new Date().getTimezoneOffset() * 60000;
    // let localTime = new Date(new Date(value).getTime() - offset);
    let localTime = new Date(value);
    let diffInHours = Math.floor(
      (new Date().valueOf() - localTime.valueOf()) / (1000*60*60)
      );
    if(diffInHours > 168){
      const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
      return localTime.toLocaleDateString(undefined,options).toString();
    }
    if(Math.floor(diffInHours/24) == 1){
      return `${Math.floor(diffInHours/24).toString()} day ago`;
    }
    if(diffInHours > 24){
      return `${Math.floor(diffInHours/24).toString()} days ago`;
    }
    if(diffInHours < 1){
      let diffInMinutes = Math.floor(
        (new Date().valueOf() - localTime.valueOf()) / (1000*60)
      );
      if(diffInMinutes <= 1){
        return 'Just now';
      }
      return `${diffInMinutes} minutes ago`
    }
    if(diffInHours == 1){
      return `${diffInHours} hour ago`;  
    }
    return `${diffInHours} hours ago`;
  }
}
