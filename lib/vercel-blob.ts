import { put, list, del, PutBlobResult } from '@vercel/blob';

/**
 * Sube un archivo a Vercel Blob
 * @param file El archivo a subir (File o Buffer)
 * @param filename Nombre del archivo destino
 * @returns Metadata del blob subido
 */
export const uploadBlob = async (file: File | Buffer | string, filename: string): Promise<PutBlobResult> => {
  return await put(filename, file, { access: 'public' });
};

/**
 * Lista todos los blobs almacenados
 */
export const listBlobs = async () => {
  return await list();
};

/**
 * Elimina un blob a partir de su URL
 * @param url URL del blob a eliminar
 */
export const deleteBlob = async (url: string) => {
  return await del(url);
};
