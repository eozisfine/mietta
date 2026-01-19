'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  created_at: string;
}

interface EventsResponse {
  events: Event[];
  hasMore: boolean;
  total: number;
}

interface EventsGridProps {
  title?: string; // categoria eventi (es: 'vetrina')
}

export default function EventsGrid({ title = 'vetrina' }: EventsGridProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEvents = async (offset: number = 0, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`/api/eventi?category=${title}&limit=6&offset=${offset}`);
      const data: EventsResponse = await response.json();

      if (append) {
        setEvents((prev) => [...prev, ...data.events]);
      } else {
        setEvents(data.events);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [title]);

  const handleLoadMore = () => {
    fetchEvents(events.length, true);
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem' }}>Caricamento...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {events && events.length > 0 ? events.map((event) => (
          <div
            key={event.id}
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
            }}
          >
            <div style={{
              height: '200px',
              overflow: 'hidden',
              backgroundColor: '#F2F2F2',
            }}>
              {event.cover_image ? (
                <img
                  src={
                    event.cover_image.startsWith('http')
                      ? event.cover_image
                      : `/${event.cover_image}`
                  }
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#848189',
                }}>
                  <span style={{ fontSize: '0.875rem' }}>Nessuna immagine</span>
                </div>
              )}
            </div>

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#5C5449',
                marginBottom: '1rem',
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {event.title}
              </h3>

              <a
                href={`/eventi/${event.slug}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  backgroundColor: '#5C5449',
                  color: 'white',
                  padding: '0.625rem 1rem',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                Apri
              </a>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
            <p style={{ color: '#848189' }}>Nessun evento disponibile</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{
              backgroundColor: 'transparent',
              color: '#5C5449',
              border: 'none',
              padding: '0.625rem 1.5rem',
              fontSize: '1rem',
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {loadingMore ? 'Caricamento...' : 'Carica di più'}
          </button>
        </div>
      )}
    </div>
  );
}
