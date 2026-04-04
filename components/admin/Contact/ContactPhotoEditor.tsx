"use client";

import { useEffect, useRef, useState } from "react";
import { ContactPhoto } from "./ContactPhoto";

interface ContactPhotoEditorProps {
  photoUrl: string | null;
  isLoading: boolean;
  onPhotoChange: (file: File) => void;
  title?: string;
}

export const ContactPhotoEditor = ({
  photoUrl,
  isLoading,
  onPhotoChange,
  title = "Foto de contacto",
}: ContactPhotoEditorProps) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const localObjectUrlRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(photoUrl);

  useEffect(() => {
    if (localObjectUrlRef.current) {
      URL.revokeObjectURL(localObjectUrlRef.current);
      localObjectUrlRef.current = null;
    }
    setPreview(photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    return () => {
      if (localObjectUrlRef.current) {
        URL.revokeObjectURL(localObjectUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      return;
    }

    if (localObjectUrlRef.current) {
      URL.revokeObjectURL(localObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    localObjectUrlRef.current = objectUrl;
    setPreview(objectUrl);
    onPhotoChange(file);
  };

  return (
    <div className="space-y-3">
      <ContactPhoto
        preview={preview}
        isLoading={isLoading}
        onEditClick={() => photoInputRef.current?.click()}
        title={title}
      />

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFileSelect(event.target.files?.[0] || null)}
      />
    </div>
  );
};
