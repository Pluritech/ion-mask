import { FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public formTest: FormGroup;

  constructor(public navCtrl: NavController, private fb: FormBuilder) {
    this.formTest = this.fb.group({
      phone: [''],
      cel: [''],
      cep: ['31.232-215']
    });
  }

}
