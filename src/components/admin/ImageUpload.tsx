'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, X, Loader2, ImageIcon, AlertCircle } from 'lucide-react';
import { storage } from '@/lib/firebase/client';
import { slugify } from '@/lib/utils';

const MAX_BYTES = 8 * 1024 * 1024; // mirrors the Storage rule

export default function ImageUpload({
  value, onChange, label = 'Cover image',
}: { value: string | null; onChange: (url: string | null) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setError('');

    // Checked here as well as in the Storage rules: failing fast is a far
    // better experience than watching an 11MB upload reach 100% and bounce.
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 8MB.`);
      return;
    }

    const name = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}`;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const task = uploadBytesResumable(storageRef(storage, `blog/${name}.${ext}`), file, {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    });

    setProgress(0);
    task.on(
      'state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        setError(
          err.code === 'storage/unauthorized'
            ? 'Upload refused. Your account may not have admin rights.'
            : 'Upload failed. Please try again.',
        );
        setProgress(null);
      },
      async () => {
        onChange(await getDownloadURL(task.snapshot.ref));
        setProgress(null);
      },
    );
  }

  return (
    <div>
      <span className="label">{label}</span>

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-ink-200">
          <Image
            src={value} alt="" width={1200} height={675}
            className="h-48 w-full object-cover" unoptimized
          />
          <button
            type="button" onClick={() => onChange(null)} aria-label="Remove image"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ink/80 text-white backdrop-blur transition-colors hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={progress !== null}
          className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 text-ink-400 transition-colors hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 disabled:cursor-wait"
        >
          {progress !== null ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
              <span className="text-[0.86rem]">Uploading… {progress}%</span>
              <span className="h-1 w-40 overflow-hidden rounded-full bg-ink-200">
                <span className="block h-full bg-gold-500 transition-all" style={{ width: `${progress}%` }} />
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="h-7 w-7" strokeWidth={1.4} aria-hidden />
              <span className="text-[0.88rem] font-medium">Choose an image</span>
              <span className="text-[0.76rem]">JPG, PNG or WebP · up to 8MB · 1600×900 works best</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden /> {error}
        </p>
      )}

      <input
        ref={input} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = ''; // allows re-picking the same file
        }}
      />

      {value && (
        <button
          type="button" onClick={() => input.current?.click()}
          className="mt-2 inline-flex items-center gap-1.5 text-[0.8rem] text-gold-700 hover:underline"
        >
          <Upload className="h-3.5 w-3.5" aria-hidden /> Replace image
        </button>
      )}
    </div>
  );
}
