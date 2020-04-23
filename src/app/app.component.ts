import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommandsService} from './services/commands.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  result = [];

  constructor(private commands: CommandsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      map: new FormControl('', [
        Validators.required
      ]),
      energy: new FormControl('', [
        Validators.required
      ])
    });
  }

  submit() {
    console.log('This value: ', this.form.value.map);
    const comm = this.commands.getCommands(this.form.value.map, this.form.value.energy);
    console.log(comm);
    return this.result = comm;
  }
}
