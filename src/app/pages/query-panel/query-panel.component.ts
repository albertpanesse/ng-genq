import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QueryService } from '../../lib/services/query.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'query-panel-comp',
  templateUrl: './query-panel.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class QueryPanelComponent implements OnInit {
  queryForm: FormGroup;
  queryResult: any;

  constructor(
    private fb: FormBuilder,
    private queryService: QueryService
  ) {
    this.queryForm = this.fb.group({
      sql: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onQuery() {
    if (this.queryForm.valid) {
      this.queryService.executeQuery(this.queryForm.value).subscribe(
        (data) => this.queryResult = data,
        (err) => console.error(err)
      );
    }
  }
}
