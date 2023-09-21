import { Component, OnInit } from "@angular/core";
import { LocaleService } from "app/models/locale.service";

@Component({
  selector: "no-record-placeholder",
  templateUrl: "./no-record.component.html",
  styleUrls: ["./no-record.component.scss"],
})
export class NoRecordComponent implements OnInit {
  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }
}
