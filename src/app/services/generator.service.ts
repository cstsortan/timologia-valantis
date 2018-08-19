import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import * as docxtemplater from 'docxtemplater';
import * as jszipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor() { }
  generate(fields: any) {
    jszipUtils.getBinaryContent('assets/timologio.docx', (error, content) => {
      if (!error) {
        const zip = new JSZip(content);
        const doc = new docxtemplater().loadZip(zip);
        doc.setData(fields);
        doc.render();
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        saveAs(out, `${fields.id}_Τιμολόγιο.docx`);
      }
    });
  }
}
