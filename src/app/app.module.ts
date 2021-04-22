import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CardPlayer } from "./card-player/card-player.component";
import { TopBarComponent } from "./top-bar/top-bar.component";

@NgModule({
  declarations: [AppComponent, TopBarComponent, CardPlayer],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([{ path: "", component: CardPlayer }]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
