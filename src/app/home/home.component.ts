import { Component, OnInit } from '@angular/core';
import { InvoiceNode } from '../models/invoice-node';
import { GeneratorService } from '../services/generator.service';
import * as date from 'date-and-time';
import * as moment from 'moment';
import { Week } from '../models/week';
import { Client } from '../models/client';
import {Issuer} from '../models/issuer';


const clients: Client[] = [
  {
    name: 'Konstantinos Panagos',
    address: 'Langenackerstr 86i',
    area: 'DE-50321 Brühl',
  },
  {
    name: 'Stavros Tsortanidis',
    address: 'Lützenkirchenerstr 12',
    area: 'DE 51379 Leverkusen',
  },
  {
    name: 'MEDA Küchenfachmarkt GmbH & Co.KG',
    address: 'Inneboltstrasse 116',
    area: '47507 Neukirchen-Vluy',
  },
  {
    name: 'Hans Segmüller Polstermöbelfabrik GmbH & Co.KG',
    address: 'Münchener Str. 35',
    area: '86316 Friedberg'
  }
];

const issuers: Issuer[] = [
  {
    name: 'Cholidis Chrysovalantios',
    address: 'Luetzenkirchenersrt. 12',
    area: 'DE-51379 Leverkusen',
    phone: '+491774802462',
    email: 'valantis.xolidis@hotmail.com',
    steuerId: '55167452038',
    blz: '44010046',
    iban: 'DE95440100460397061463',
    big: 'PBNKDEFF'
  }, {
    name: 'Stavros Tsortanidis',
    address: 'Luetzenkirchenersrt. 12',
    area: 'DE-51379 Leverkusen',
    phone: '+49 160 98563334',
    email: 'stavros.tsortanidis@gmail.com',
    steuerId: '58067493108',
    blz: '37010050',
    iban: 'DE54370100500980683503',
    big: 'PBNKDEFF'
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  invoiceNodes: InvoiceNode[] = [];
  issueDate = new Date();
  invoiceNumber = 0;
  weekNumber = moment().format('WW');
  clientInfo: Client;
  readonly allClients: Client[] = clients;
  readonly allIssuers: Issuer[] = issuers;
  weeks: Week[];
  issuerInfo: Issuer = {} as Issuer;

  constructor(
    private generatorService: GeneratorService,
  ) {
  }

  presetSelected(event) {
    this.clientInfo = {...event};
  }
  presetIssuerSelected(event) {
    this.issuerInfo = {...event};
  }

  ngOnInit() {
    this.weeks = [];
    for (let i = 1; i <= moment().weeksInYear(); i++) {
      this.weeks.push({
        weekNumber: i.toString(),
        finishDate: this.getRangeForWeek(i.toString())[1],
        startDate: this.getRangeForWeek(i.toString())[0],
      });
    }
    this.clientInfo = {} as Client;
  }

  addInvoiceNode() {
    this.invoiceNodes.push({
      date: new Date(),
      price: 0.00,
      extraInfo: ''
    });
  }

  delete(i: number) {
    this.invoiceNodes.splice(i, 1);
  }

  getRangeForWeek(week: string): string[] {
    const weekNumber = parseInt(week, 10);
    const d = new Date(`Jan 01, ${new Date().getFullYear()} 01:00:00`);
    const w = d.getTime() + 604800000 * (weekNumber - 1);
    const n1 = new Date(w);
    const n2 = new Date(w + 518400000);
    return [date.format(n1, 'DD/MM/YY'), date.format(n2, 'DD/MM/YY')];
  }

  generateInvoice() {
    const netto = this.invoiceNodes.map(val => val.price).reduce((a, b) => a + b, 0);
    this.generatorService.generate({
      nodes: this.invoiceNodes.map(val => {
        return {
          date: date.format(val.date, 'DD/MM'),
          price: `${val.price.toFixed(2)}`,
          extraInfo: val.extraInfo,
        };
      }),
      id: this.invoiceNumber,
      issueDate: date.format(this.issueDate, 'DD/MM/YYYY'),
      week: this.weekNumber,
      netto: netto.toFixed(2),
      fpa: (netto * 0.19).toFixed(2),
      brutto: (netto * 1.19).toFixed(2),
      clientName: this.clientInfo.name,
      clientAddress: this.clientInfo.address,
      clientArea: this.clientInfo.area,
      wn: this.weekNumber,
      wstart: this.getRangeForWeek(this.weekNumber)[0],
      wfinish: this.getRangeForWeek(this.weekNumber)[1],
      issuerName: this.issuerInfo.name,
      issuerIban: this.issuerInfo.iban,
      issuerAddress: this.issuerInfo.address,
      issuerArea: this.issuerInfo.area,
      issuerPhone: this.issuerInfo.phone,
      issuerEmail: this.issuerInfo.email,
      issuerBlz: this.issuerInfo.blz,
      issuerBig: this.issuerInfo.big,
      issuerSteuerId: this.issuerInfo.steuerId,
    });
  }
}
