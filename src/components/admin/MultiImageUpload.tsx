import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MultiImageUploadProps {
    urls: string[];
    onChange: (urls: string[]) => void;
    folder?: string;
    maxImages?: number;
}

export function MultiImageUpload({ urls, onChange, folder = 'products', maxImages = 4 }: MultiImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sanitize = (str: string) =>
        str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

    const processFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error(`"${file.name}" is not a valid image format.`);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(`"${file.name}" exceeds the 5MB limit.`);
            return;
        }

        if (urls.length >= maxImages) {
            toast.error(`Maximum of ${maxImages} images allowed.`);
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop() || 'jpg';
            const baseName = sanitize(file.name.replace(`.${fileExt}`, ''));
            const storagePath = `${folder}/${Math.random().toString(36).substring(2, 6)}-${baseName}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('public-images')
                .upload(storagePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('public-images')
                .getPublicUrl(storagePath);

            onChange([...urls, publicUrl]);
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        if (urls.length + files.length > maxImages) {
            toast.error(`You can only select ${maxImages - urls.length} more image(s).`);
            return;
        }

        for (const file of files) {
            await processFile(file);
        }
    };

    const handleRemove = async (urlToRemove: string) => {
        // Optionally delete from storage here, but for now we just remove from array
        // to prevent accidental deletion if they haven't saved the product yet.
        onChange(urls.filter(url => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            {/* Existing Images Grid */}
            {urls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {urls.map((url, index) => (
                        <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-border group bg-muted">
                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm backdrop-blur-sm">
                                    Main
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); handleRemove(url); }}
                                    className="bg-destructive hover:bg-destructive/90 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add More Button (if under limit) */}
                    {urls.length < maxImages && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer text-muted-foreground group"
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-1">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-1">
                                        <ImagePlus className="w-5 h-5 text-primary group-hover:text-current" />
                                    </div>
                                    <span className="text-xs font-medium">Add Image</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Empty State Upload Area */}
            {urls.length === 0 && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video sm:aspect-[21/9] rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer text-muted-foreground group"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="text-sm font-medium">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-center p-4">
                            <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-2">
                                <Upload className="w-6 h-6 text-primary group-hover:text-current" />
                            </div>
                            <span className="font-medium text-foreground">Click to upload product images</span>
                            <span className="text-xs">Max {maxImages} images (5MB each, JPG/PNG/WebP)</span>
                        </div>
                    )}
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading || urls.length >= maxImages}
            />
        </div>
    );
}
