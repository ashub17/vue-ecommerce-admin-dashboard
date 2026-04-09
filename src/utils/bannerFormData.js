export function buildBannerFormData(payload, isUpdate = false) {
  const formData = new FormData();

  formData.append('title', payload.title ?? '');
  formData.append('subtitle', payload.subtitle ?? '');
  formData.append('button_text', payload.button_text ?? '');
  formData.append('button_link', payload.button_link ?? '');
  formData.append('sort_order', payload.sort_order ?? '');
  formData.append('is_active', payload.is_active ? '1' : '0');

  if (payload.image instanceof File) {
    formData.append('image', payload.image);
  }

  if (isUpdate) {
    formData.append('_method', 'PUT');
  }

  return formData;
}
