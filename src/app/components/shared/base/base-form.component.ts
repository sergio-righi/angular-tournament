import { Input, OnInit } from '@angular/core';
import { Directive } from '@angular/core';
import { ObjectID } from 'bson';

@Directive({
  selector: '[appBaseForm]'
})
export abstract class BaseFormComponent implements OnInit {
  ngOnInit(): void { }

  get objectID(): string {
    return new ObjectID().toString()
  }
}