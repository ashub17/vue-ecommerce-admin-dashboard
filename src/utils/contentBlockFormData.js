export function buildContentBlockFormData(payload, isUpdate = false) {
  const formData = new FormData();

  formData.append('key', payload.key ?? '');
  formData.append('title', payload.title ?? '');
  formData.append('content', payload.content ?? '');
  formData.append('is_active', payload.is_active ? '1' : '0');

  if (payload.meta !== undefined && payload.meta !== null) {
    formData.append('meta', JSON.stringify(payload.meta));
  }

  if (payload.image instanceof File) {
    formData.append('image', payload.image);
  }

  if (isUpdate) {
    formData.append('_method', 'PUT');
  }

  return formData;
}
