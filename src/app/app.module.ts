import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";

import { routes } from "./app.routes";

import { SigninComponent } from "./pages/signin/signin.component";
import { RegisterComponent } from "./pages/register/register.component";
import { BrowserModule } from "@angular/platform-browser";
import { HomeComponent } from "./pages/home/home.component";
import { provideHttpClient } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, HomeComponent, RegisterComponent, SigninComponent],
  imports: [BrowserModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [provideHttpClient()],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
