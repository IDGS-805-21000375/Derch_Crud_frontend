import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Output() productCreated = new EventEmitter<Product>();
  @Output() productUpdated = new EventEmitter<Product>();

  productForm: FormGroup;
  isEditing = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnChanges(): void {
    if (this.product) {
      this.isEditing = true;
      this.productForm.patchValue(this.product);
    } else {
      this.isEditing = false;
      this.productForm.reset();
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const productData: Product = this.productForm.value;

      if (this.isEditing && this.product) {
        //  PUT - Actualizar producto existente
        this.productService.updateProduct(this.product.id!, productData).subscribe({
          next: (updatedProduct) => {
            this.productUpdated.emit(updatedProduct);
            this.productForm.reset();
            this.isEditing = false;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
            alert('Error al actualizar producto');
            this.loading = false;
          }
        });
      } else {
        //  POST - Crear nuevo producto
        this.productService.createProduct(productData).subscribe({
          next: (newProduct) => {
            this.productCreated.emit(newProduct);
            this.productForm.reset();
            this.loading = false;
            alert('Producto creado correctamente');
          },
          error: (error) => {
            console.error('Error al crear producto:', error);
            alert('Error al crear producto');
            this.loading = false;
          }
        });
      }
    }
  }

  cancelEdit(): void {
    this.productForm.reset();
    this.isEditing = false;
    this.product = null;
  }

  get nombre() { return this.productForm.get('nombre'); }
  get precio() { return this.productForm.get('precio'); }
  get descripcion() { return this.productForm.get('descripcion'); }
}