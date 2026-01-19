'use client';

import { useState, useEffect } from 'react';
import { Paper, Text, Button, Group, Anchor, Stack } from '@mantine/core';
import { IconCookie } from '@tabler/icons-react';

const COOKIE_CONSENT_KEY = 'mietta-cookie-consent';

type ConsentValue = 'accepted' | 'rejected' | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (storedConsent === 'accepted' || storedConsent === 'rejected') {
      setConsent(storedConsent);
    }
    setIsLoaded(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsent('accepted');
    // Here you can enable analytics/tracking scripts
    enableAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setConsent('rejected');
    // Disable any non-essential cookies/tracking
    disableAnalytics();
  };

  const enableAnalytics = () => {
    // Enable Vercel Analytics or other tracking
    // This is where you would initialize analytics if consent is given
    if (typeof window !== 'undefined') {
      (window as any).cookieConsent = 'accepted';
    }
  };

  const disableAnalytics = () => {
    // Disable any tracking
    if (typeof window !== 'undefined') {
      (window as any).cookieConsent = 'rejected';
    }
  };

  // Don't render anything on server or if consent is already given
  if (!isLoaded || consent !== null) {
    return null;
  }

  return (
    <>
      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background-color: white;
          border-top: 1px solid #e0e0e0;
          padding: 16px;
        }
        @media (min-width: 768px) {
          .cookie-banner {
            bottom: 20px;
            left: 20px;
            right: auto;
            max-width: 420px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
        }
      `}</style>
      <div className="cookie-banner">
        <Group gap="sm" mb="sm" wrap="nowrap">
          <IconCookie size={28} style={{ flexShrink: 0, color: '#6B7A8C' }} />
          <Text size="md" fw={600}>
            Questo sito utilizza i cookie
          </Text>
        </Group>

        <Text size="sm" c="dimmed" mb="md" lh={1.5}>
          Utilizziamo cookie tecnici necessari per il funzionamento del sito.
          Per maggiori informazioni, consulta la nostra{' '}
          <Anchor href="/privacy" size="sm" fw={500}>
            Privacy e Cookie Policy
          </Anchor>
          .
        </Text>

        <Group gap="sm" grow>
          <Button
            variant="outline"
            color="gray"
            size="md"
            onClick={handleReject}
          >
            Rifiuta
          </Button>
          <Button
            size="md"
            color="dark"
            onClick={handleAccept}
          >
            Accetta
          </Button>
        </Group>
      </div>
    </>
  );
}

// Export a hook to check consent status
export function useCookieConsent(): ConsentValue {
  const [consent, setConsent] = useState<ConsentValue>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (storedConsent === 'accepted' || storedConsent === 'rejected') {
      setConsent(storedConsent);
    }
  }, []);

  return consent;
}
