import { supabase } from './supabase';

export type BucketName = 'coupon-images' | 'news-images' | 'partner-logos';

/**
 * Compress and resize image before upload
 */
const compressImage = async (file: File, maxWidth: number = 800): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    0.85
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

/**
 * Upload image to Supabase Storage
 */
export const uploadImage = async (
    file: File,
    bucket: BucketName,
    folder: string = ''
): Promise<string | null> => {
    if (!supabase) {
        console.error('Supabase not configured');
        return null;
    }

    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB');
        }

        // Compress image
        const compressedBlob = await compressImage(file);

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, compressedBlob, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Delete image from Supabase Storage
 */
export const deleteImage = async (
    url: string,
    bucket: BucketName
): Promise<boolean> => {
    if (!supabase) {
        console.error('Supabase not configured');
        return false;
    }

    try {
        // Extract file path from URL
        const urlParts = url.split('/');
        const filePath = urlParts.slice(urlParts.indexOf(bucket) + 1).join('/');

        const { error } = await supabase.storage.from(bucket).remove([filePath]);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: '画像ファイルを選択してください' };
    }

    if (file.size > 5 * 1024 * 1024) {
        return { valid: false, error: 'ファイルサイズは5MB以下にしてください' };
    }

    return { valid: true };
};
