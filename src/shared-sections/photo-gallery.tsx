'use client';

import { useState } from 'react';
import { MasonryPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/masonry.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Photo {
  src: string;
  width: number;
  height: number;
}

interface PhotoGalleryProps {
  title?: string; // JSON array of photos
  text?: string;  // Options: "bullets" to show bullet navigation
}

export default function PhotoGallery({ title, text }: PhotoGalleryProps) {
  const [index, setIndex] = useState(-1);

  // Parse photos from JSON
  let photos: Photo[] = [];
  if (title) {
    try {
      photos = JSON.parse(title);
    } catch {
      // Empty gallery if parsing fails
    }
  }

  // Check if bullets mode is enabled
  const showBullets = text?.toLowerCase().includes('bullets');

  if (photos.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#848189' }}>
        Nessuna foto disponibile
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <MasonryPhotoAlbum
        photos={photos}
        columns={(containerWidth) => {
          if (containerWidth < 400) return 1;
          if (containerWidth < 800) return 2;
          return 3;
        }}
        spacing={8}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos}
        render={showBullets ? {
          buttonPrev: () => null,
          buttonNext: () => null,
        } : undefined}
        controller={showBullets ? { closeOnBackdropClick: true } : undefined}
      />

      {/* Bullet navigation */}
      {showBullets && index >= 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001,
          display: 'flex',
          gap: '8px',
        }}>
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
