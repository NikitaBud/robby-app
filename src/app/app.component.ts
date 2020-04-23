import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommandsService} from './services/commands.service';

interface Field {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  result = [];
  fields: Field[] = [
    {value: '4', viewValue: '4'},
    {value: '9', viewValue: '9'},
    {value: '16', viewValue: '16'},
    {value: '25', viewValue: '25'},
    {value: '36', viewValue: '36'},
    {value: '49', viewValue: '49'},
    {value: '64', viewValue: '64'},
    {value: '81', viewValue: '81'}
  ];

  constructor(private commands: CommandsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      map: new FormControl('', [
        Validators.required
      ]),
      energy: new FormControl('', [
        Validators.required
      ]),
      fieldSize: new FormControl('', Validators.required)
    });
  }

  submit() {
    console.log('This value: ', this.form.value.map);
    const comm = this.commands.getCommands(this.form.value.map, this.form.value.energy);
    console.log(comm);
    return this.result = comm;
  }
}
