import {Component, Inject, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-prompt',
  templateUrl: './delete-prompt.component.html',
  styleUrls: ['./delete-prompt.component.scss']
})
export class DeletePromptComponent implements OnInit {
  productName = '';

  constructor(private productService: ProductService,
              @Inject(MAT_DIALOG_DATA) public deleteData : any,
              private dialogRef : MatDialogRef<DeletePromptComponent>) { }

  ngOnInit(): void {
    this.productName = this.deleteData.name;
  }

  continueDelete() {
    return this.productService.deleteProduct(this.deleteData.id)
      .subscribe({
        next: () => {
          alert("Product Deleted Successfully!")
          this.dialogRef.close()
        },
        error:()=>{
          alert("Error While Deleting The Record")
        }
      })
  }

}
