import { Container, Paper } from '@mantine/core';

interface GoogleMapProps {
  title?: string; // Indirizzo o URL della mappa
}

export default function GoogleMap({ title }: GoogleMapProps) {
  const address = title || "Via+Massimo+d'Azeglio,+1271,+41052+Rocca+Malatina";
  const mapUrl = title?.startsWith('http')
    ? title
    : `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <Container size="xl" py="xl">
      <Paper
        radius="md"
        style={{
          overflow: 'hidden',
          height: '500px',
          border: '2px solid #848189'
        }}
      >
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        />
      </Paper>
    </Container>
  );
}
