export function buildProductFormData(payload, isUpdate = false) {
  const formData = new FormData();

  formData.append('category_id', payload.category_id ?? '');
  formData.append('name', payload.name ?? '');
  formData.append('sku', payload.sku ?? '');
  formData.append('slug', payload.slug ?? '');
  formData.append('short_description', payload.short_description ?? '');
  formData.append('description', payload.description ?? '');
  formData.append('price', payload.price ?? '');
  formData.append('sale_price', payload.sale_price ?? '');
  formData.append('stock_quantity', payload.stock_quantity ?? '');
  formData.append('is_active', payload.is_active ? '1' : '0');
  formData.append('is_featured', payload.is_featured ? '1' : '0');

  if (payload.featured_image instanceof File) {
    formData.append('featured_image', payload.featured_image);
  }

  if (Array.isArray(payload.images)) {
    let imageIndex = 0;

    payload.images.forEach((item) => {
      if (item.file instanceof File) {
        formData.append(`images[${imageIndex}]`, item.file);
        formData.append(
          `image_sort_orders[${imageIndex}]`,
          item.sort_order ?? imageIndex + 1,
        );
        imageIndex++;
      }
    });
  }

  if (isUpdate) {
    formData.append('_method', 'PUT');
  }

  return formData;
}
