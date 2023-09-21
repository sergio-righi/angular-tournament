import { Component, Input, OnInit } from "@angular/core";
import { LocaleService } from "app/models/locale.service";

@Component({
  selector: "loading-placeholder",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent implements OnInit {
  @Input() indicator: boolean = false;

  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }
}
