import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {

  constructor() { }

  convertToCSV(objArray: any[]): string {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    // Extract headers
    let header = Object.keys(array[0]);
    let headerToKeep = header.slice(2); // Skip the first column
    row += headerToKeep.join(',');
    row += '\r\n';

    // Extract data
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (header.indexOf(index) > 1 && header.indexOf(index) < 4) {
          if (line != '') line += ',';
          line += `"${array[i][index]}"`;
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadFile(data: any[], filename = 'data') {
    let csvData = this.convertToCSV(data);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;

    // If Safari, use a different method
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
}
