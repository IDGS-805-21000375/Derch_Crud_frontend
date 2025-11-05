import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productDetails: Product | null = null;
  showDetails = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // GET todos los productos
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar productos');
      }
    });
  }

  // GET producto por ID (NUEVO)
  viewProductDetails(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productDetails = product;
        this.showDetails = true;
        this.selectedProduct = null; // Limpiar selección de edición
      },
      error: (error) => {
        console.error('Error al cargar detalles:', error);
        alert('Error al cargar detalles del producto');
      }
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.showDetails = false; // Ocultar detalles al seleccionar para editar
  }

  // DELETE producto
  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.selectedProduct = null;
          this.productDetails = null;
          this.showDetails = false;
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          alert('Error al eliminar producto');
        }
      });
    }
  }

  // POST crear producto
  onProductCreated(newProduct: Product): void {
    this.products.push(newProduct);
    this.loadProducts(); // Recargar para obtener el ID generado
  }

  // PUT actualizar producto
  onProductUpdated(updatedProduct: Product): void {
    this.productService.updateProduct(updatedProduct.id!, updatedProduct).subscribe({
      next: (product) => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = product;
        }
        this.selectedProduct = null;
        alert('Producto actualizado correctamente');
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        alert('Error al actualizar producto');
      }
    });
  }

  closeDetails(): void {
    this.showDetails = false;
    this.productDetails = null;
  }
}