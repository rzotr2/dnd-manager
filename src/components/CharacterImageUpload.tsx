
import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CharacterImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  characterId?: string;
  disabled?: boolean;
}

const CharacterImageUpload: React.FC<CharacterImageUploadProps> = ({
  currentImage,
  onImageChange,
  characterId,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Помилка',
        description: 'Будь ласка, оберіть файл зображення',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Помилка',
        description: 'Розмір файлу не може перевищувати 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${characterId || Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('character-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('character-images')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);

      toast({
        title: 'Успіх',
        description: 'Зображення завантажено успішно',
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити зображення',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (currentImage && characterId) {
      try {
        // Extract file path from URL
        const urlParts = currentImage.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const filePath = `${user.id}/${fileName}`;
          await supabase.storage
            .from('character-images')
            .remove([filePath]);
        }
      } catch (error) {
        console.error('Error removing image:', error);
      }
    }

    setPreviewUrl(null);
    onImageChange(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {previewUrl ? (
        <Card className="relative overflow-hidden">
          <div className="aspect-square w-full max-w-xs mx-auto">
            <img
              src={previewUrl}
              alt="Персонаж"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {!disabled && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <Button
            variant="ghost"
            onClick={triggerFileInput}
            disabled={disabled || isUploading}
            className="w-full h-32 flex flex-col gap-2 text-muted-foreground"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Завантаження...</span>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8" />
                <span className="text-sm">Додати фото персонажа</span>
                <span className="text-xs">PNG, JPG до 5MB</span>
              </>
            )}
          </Button>
        </Card>
      )}

      {!previewUrl && !disabled && (
        <Button
          variant="outline"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Завантаження...' : 'Завантажити зображення'}
        </Button>
      )}
    </div>
  );
};

export default CharacterImageUpload;
