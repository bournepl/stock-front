import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../_services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../../_services/storage.service';
import { Menu } from '../../../_model/menu';
import { OrderDetail } from '../../../_model/orderDetail';
import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ExcelService } from '../../../_services/excel.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  getOrderDetail: OrderDetail;

  cartMenuList: Menu[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileName: string;
  @ViewChild('staticModalImport', { static: false }) staticModalImport: ModalDirective;


  constructor(
    private router: Router,
    private orderService: OrderService,
    private loadingBar: NgxSpinnerService,
    private token: StorageService,
    private excelService: ExcelService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {

    this.getSales();

  }

  getSales() {
    this.loadingBar.show();

    this.route.params.subscribe((params) => {
      this.orderService.getById(params['id']).subscribe(
        (data) => {
          this.getOrderDetail = data;

          this.cartMenuList = this.getOrderDetail.menu;


          this.loadingBar.hide();
        },
        (error) => {
          this.loadingBar.hide();
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            confirmButtonColor: '#07cdae',
            text: error.error.message,
          });
        }
      );
    });
  }

  onApporved(id: any) {
    Swal.fire({
      title: 'อนุมัติรายการ?',
      text: "คุณต้องการอนุมัติรายการ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07cdae',
      cancelButtonColor: '#fe7096',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'

    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingBar.show();
        this.orderService.approved(this.token.getUser().uniqueKey, id).subscribe(
          reponse => {
            if (reponse.message == "Successfully!") {
              this.loadingBar.hide();
              Swal.fire({
                icon: 'success',
                title: 'อนุมัติรายการสำเร็จ',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.getSales();

              })
            }

          },
          error => {
            this.loadingBar.hide();
            Swal.fire({
              icon: "warning",
              title: 'Oops...',
              confirmButtonColor: '#07cdae',
              text: error.error.message,
            })

          });
      }
    })
  }
  reloadPage(): void {
    window.location.reload();
  }
  /**
*
* Import Data
*
*
*/

  showChildModalImport(): void {
    this.staticModalImport.show();
  }
  hideChildModalImport(): void {

    this.staticModalImport.hide();
  }


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles!.item(0)!.name;
  }


  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {

        this.currentFile = file;

        this.excelService.uploadImportMenu(this.token.getUser().uniqueKey, this.token.getBranchId(), this.getOrderDetail.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              if (event.body.message == "Successfully!") {
                this.loadingBar.hide();
                Swal.fire({
                  icon: 'success',
                  title: 'Uploaded the file successfully',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  this.reloadPage();

                })

              }
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            Swal.fire({
              icon: "warning",
              title: 'Oops...',
              confirmButtonColor: '#07cdae',
              text: this.message,
            })


            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }
}
