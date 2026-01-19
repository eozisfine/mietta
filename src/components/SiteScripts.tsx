'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface SiteSettings {
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  meta_pixel_id?: string;
  custom_head_scripts?: string;
  custom_body_scripts?: string;
}

export default function SiteScripts() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoaded(true);
      }
    };

    fetchSettings();
  }, []);

  if (!loaded) return null;

  return (
    <>
      {/* Google Tag Manager - Head */}
      {settings.google_tag_manager_id && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
            `,
          }}
        />
      )}

      {/* Google Analytics 4 */}
      {settings.google_analytics_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.google_analytics_id}');
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel */}
      {settings.meta_pixel_id && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.meta_pixel_id}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* Custom Head Scripts */}
      {settings.custom_head_scripts && (
        <Script
          id="custom-head-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: settings.custom_head_scripts,
          }}
        />
      )}

      {/* Custom Body Scripts */}
      {settings.custom_body_scripts && (
        <Script
          id="custom-body-scripts"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: settings.custom_body_scripts,
          }}
        />
      )}
    </>
  );
}

// Componente separato per il noscript GTM (da mettere nel body)
export function GTMNoScript({ gtmId }: { gtmId?: string }) {
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
