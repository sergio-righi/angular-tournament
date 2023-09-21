import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/models/auth.service";
import { LocaleService } from "app/models/locale.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Input() title?: string;

  constructor(public auth: AuthService, private router: Router, public locale: LocaleService) { }

  ngOnInit(): void { }

  logout() {
    if (confirm(this.locale.t.message.delete_confirmation)) {
      this.auth.clear();
      this.router.navigateByUrl("/");
    }
  }
}
