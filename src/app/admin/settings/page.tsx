'use client';

import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
  Alert,
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconCheck,
  IconCode,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPhoto,
  IconSettings,
  IconTrash,
  IconWorld
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import AssetPickerDrawer from '@/components/AssetPickerDrawer';

interface Settings {
  // Info generali
  site_name: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;

  // Contatti
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_city: string;
  contact_cap: string;
  contact_province: string;
  vat_number: string;

  // Social
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  social_tiktok: string;

  // Script e analytics
  google_analytics_id: string;
  google_tag_manager_id: string;
  meta_pixel_id: string;
  custom_head_scripts: string;
  custom_body_scripts: string;

  // Cookie e privacy
  cookie_policy_url: string;
  privacy_policy_url: string;
}

const defaultSettings: Settings = {
  site_name: '',
  site_description: '',
  logo_url: '',
  favicon_url: '',
  contact_email: '',
  contact_phone: '',
  contact_address: '',
  contact_city: '',
  contact_cap: '',
  contact_province: '',
  vat_number: '',
  social_facebook: '',
  social_instagram: '',
  social_linkedin: '',
  social_youtube: '',
  social_tiktok: '',
  google_analytics_id: '',
  google_tag_manager_id: '',
  meta_pixel_id: '',
  custom_head_scripts: '',
  custom_body_scripts: '',
  cookie_policy_url: '',
  privacy_policy_url: ''
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'logo' | 'favicon'>('logo');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (error) {
      console.error('Errore fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Errore salvataggio:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const openAssetPicker = (target: 'logo' | 'favicon') => {
    setAssetPickerTarget(target);
    setAssetPickerOpen(true);
  };

  const handleAssetSelect = (url: string) => {
    if (assetPickerTarget === 'logo') {
      updateSetting('logo_url', url);
    } else {
      updateSetting('favicon_url', url);
    }
  };

  if (loading) {
    return (
      <Container size="lg" py="md">
        <Text c="dimmed">Caricamento impostazioni...</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Group justify="space-between" mb="lg">
        <Group gap="xs">
          <IconSettings size={24} />
          <Title order={3}>Impostazioni Sito</Title>
        </Group>
        <Button
          onClick={handleSave}
          loading={saving}
          leftSection={saved ? <IconCheck size={16} /> : undefined}
          color={saved ? 'green' : 'blue'}
        >
          {saved ? 'Salvato!' : 'Salva impostazioni'}
        </Button>
      </Group>

      <Tabs defaultValue="general">
        <Tabs.List mb="md">
          <Tabs.Tab value="general" leftSection={<IconWorld size={14} />}>
            Generale
          </Tabs.Tab>
          <Tabs.Tab value="contact" leftSection={<IconMail size={14} />}>
            Contatti
          </Tabs.Tab>
          <Tabs.Tab value="social" leftSection={<IconBrandInstagram size={14} />}>
            Social
          </Tabs.Tab>
          <Tabs.Tab value="scripts" leftSection={<IconCode size={14} />}>
            Script & Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab Generale */}
        <Tabs.Panel value="general">
          <Stack gap="md">
            <Card withBorder p="md">
              <Text fw={600} mb="md">Informazioni sito</Text>
              <Stack gap="sm">
                <TextInput
                  label="Nome sito"
                  placeholder="es. Sassi Arredamenti"
                  value={settings.site_name}
                  onChange={(e) => updateSetting('site_name', e.target.value)}
                />
                <Textarea
                  label="Descrizione sito"
                  placeholder="Breve descrizione del sito..."
                  value={settings.site_description}
                  onChange={(e) => updateSetting('site_description', e.target.value)}
                  rows={3}
                />
              </Stack>
            </Card>

            <Card withBorder p="md">
              <Text fw={600} mb="md">Immagini</Text>
              <Stack gap="md">
                {/* Logo */}
                <Box>
                  <Text size="sm" fw={500} mb={4}>Logo</Text>
                  <Text size="xs" c="dimmed" mb="xs">Logo principale del sito</Text>
                  {settings.logo_url ? (
                    <Group gap="sm">
                      <Box
                        style={{
                          border: '1px solid var(--mantine-color-gray-3)',
                          borderRadius: 8,
                          padding: 8,
                          background: '#f8f9fa'
                        }}
                      >
                        <Image
                          src={settings.logo_url}
                          alt="Logo"
                          h={60}
                          w="auto"
                          fit="contain"
                        />
                      </Box>
                      <Stack gap={4}>
                        <Button
                          variant="light"
                          size="xs"
                          leftSection={<IconPhoto size={14} />}
                          onClick={() => openAssetPicker('logo')}
                        >
                          Cambia
                        </Button>
                        <Button
                          variant="subtle"
                          size="xs"
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => updateSetting('logo_url', '')}
                        >
                          Rimuovi
                        </Button>
                      </Stack>
                    </Group>
                  ) : (
                    <Button
                      variant="light"
                      leftSection={<IconPhoto size={16} />}
                      onClick={() => openAssetPicker('logo')}
                    >
                      Seleziona logo
                    </Button>
                  )}
                </Box>

                {/* Favicon */}
                <Box>
                  <Text size="sm" fw={500} mb={4}>Favicon</Text>
                  <Text size="xs" c="dimmed" mb="xs">Icona che appare nella tab del browser (consigliato: 32x32 px)</Text>
                  {settings.favicon_url ? (
                    <Group gap="sm">
                      <Box
                        style={{
                          border: '1px solid var(--mantine-color-gray-3)',
                          borderRadius: 8,
                          padding: 8,
                          background: '#f8f9fa'
                        }}
                      >
                        <Image
                          src={settings.favicon_url}
                          alt="Favicon"
                          h={32}
                          w={32}
                          fit="contain"
                        />
                      </Box>
                      <Stack gap={4}>
                        <Button
                          variant="light"
                          size="xs"
                          leftSection={<IconPhoto size={14} />}
                          onClick={() => openAssetPicker('favicon')}
                        >
                          Cambia
                        </Button>
                        <Button
                          variant="subtle"
                          size="xs"
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => updateSetting('favicon_url', '')}
                        >
                          Rimuovi
                        </Button>
                      </Stack>
                    </Group>
                  ) : (
                    <Button
                      variant="light"
                      leftSection={<IconPhoto size={16} />}
                      onClick={() => openAssetPicker('favicon')}
                    >
                      Seleziona favicon
                    </Button>
                  )}
                </Box>
              </Stack>
            </Card>

            <Card withBorder p="md">
              <Text fw={600} mb="md">Privacy e Cookie</Text>
              <Stack gap="sm">
                <TextInput
                  label="URL Privacy Policy"
                  placeholder="/privacy-policy"
                  value={settings.privacy_policy_url}
                  onChange={(e) => updateSetting('privacy_policy_url', e.target.value)}
                />
                <TextInput
                  label="URL Cookie Policy"
                  placeholder="/cookie-policy"
                  value={settings.cookie_policy_url}
                  onChange={(e) => updateSetting('cookie_policy_url', e.target.value)}
                />
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Tab Contatti */}
        <Tabs.Panel value="contact">
          <Stack gap="md">
            <Card withBorder p="md">
              <Text fw={600} mb="md">Contatti principali</Text>
              <Stack gap="sm">
                <TextInput
                  label="Email"
                  placeholder="info@example.com"
                  leftSection={<IconMail size={16} />}
                  value={settings.contact_email}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                />
                <TextInput
                  label="Telefono"
                  placeholder="+39 0123 456789"
                  leftSection={<IconPhone size={16} />}
                  value={settings.contact_phone}
                  onChange={(e) => updateSetting('contact_phone', e.target.value)}
                />
              </Stack>
            </Card>

            <Card withBorder p="md">
              <Text fw={600} mb="md">Indirizzo</Text>
              <Stack gap="sm">
                <TextInput
                  label="Via/Indirizzo"
                  placeholder="Via Roma 123"
                  leftSection={<IconMapPin size={16} />}
                  value={settings.contact_address}
                  onChange={(e) => updateSetting('contact_address', e.target.value)}
                />
                <Group grow>
                  <TextInput
                    label="Citta"
                    placeholder="Milano"
                    value={settings.contact_city}
                    onChange={(e) => updateSetting('contact_city', e.target.value)}
                  />
                  <TextInput
                    label="CAP"
                    placeholder="20100"
                    value={settings.contact_cap}
                    onChange={(e) => updateSetting('contact_cap', e.target.value)}
                  />
                  <TextInput
                    label="Provincia"
                    placeholder="MI"
                    value={settings.contact_province}
                    onChange={(e) => updateSetting('contact_province', e.target.value)}
                  />
                </Group>
                <TextInput
                  label="Partita IVA"
                  placeholder="IT12345678901"
                  value={settings.vat_number}
                  onChange={(e) => updateSetting('vat_number', e.target.value)}
                />
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Tab Social */}
        <Tabs.Panel value="social">
          <Card withBorder p="md">
            <Text fw={600} mb="md">Link Social Media</Text>
            <Stack gap="sm">
              <TextInput
                label="Facebook"
                placeholder="https://facebook.com/..."
                leftSection={<IconBrandFacebook size={16} />}
                value={settings.social_facebook}
                onChange={(e) => updateSetting('social_facebook', e.target.value)}
              />
              <TextInput
                label="Instagram"
                placeholder="https://instagram.com/..."
                leftSection={<IconBrandInstagram size={16} />}
                value={settings.social_instagram}
                onChange={(e) => updateSetting('social_instagram', e.target.value)}
              />
              <TextInput
                label="LinkedIn"
                placeholder="https://linkedin.com/company/..."
                leftSection={<IconBrandLinkedin size={16} />}
                value={settings.social_linkedin}
                onChange={(e) => updateSetting('social_linkedin', e.target.value)}
              />
              <TextInput
                label="YouTube"
                placeholder="https://youtube.com/..."
                leftSection={<IconBrandYoutube size={16} />}
                value={settings.social_youtube}
                onChange={(e) => updateSetting('social_youtube', e.target.value)}
              />
              <TextInput
                label="TikTok"
                placeholder="https://tiktok.com/@..."
                value={settings.social_tiktok}
                onChange={(e) => updateSetting('social_tiktok', e.target.value)}
              />
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Tab Script & Analytics */}
        <Tabs.Panel value="scripts">
          <Stack gap="md">
            <Alert icon={<IconInfoCircle size={16} />} color="yellow">
              Inserisci solo gli ID, non script completi. Gli script verranno generati automaticamente.
            </Alert>

            <Card withBorder p="md">
              <Text fw={600} mb="md">Tracking e Analytics</Text>
              <Stack gap="sm">
                <TextInput
                  label="Google Analytics 4 (ID)"
                  placeholder="G-XXXXXXXXXX"
                  value={settings.google_analytics_id}
                  onChange={(e) => updateSetting('google_analytics_id', e.target.value)}
                  description="Solo l'ID di misurazione GA4"
                />
                <TextInput
                  label="Google Tag Manager (ID)"
                  placeholder="GTM-XXXXXXX"
                  value={settings.google_tag_manager_id}
                  onChange={(e) => updateSetting('google_tag_manager_id', e.target.value)}
                  description="Solo l'ID del container GTM"
                />
                <TextInput
                  label="Meta Pixel (ID)"
                  placeholder="1234567890"
                  value={settings.meta_pixel_id}
                  onChange={(e) => updateSetting('meta_pixel_id', e.target.value)}
                  description="Solo l'ID numerico del pixel"
                />
              </Stack>
            </Card>

            <Card withBorder p="md">
              <Text fw={600} mb="md">Script personalizzati</Text>
              <Stack gap="sm">
                <Textarea
                  label="Script nell'head"
                  placeholder="<!-- Script aggiuntivi per head -->"
                  value={settings.custom_head_scripts}
                  onChange={(e) => updateSetting('custom_head_scripts', e.target.value)}
                  rows={4}
                  description="Verranno inseriti prima della chiusura del tag head"
                  styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
                />
                <Textarea
                  label="Script nel body"
                  placeholder="<!-- Script aggiuntivi per body -->"
                  value={settings.custom_body_scripts}
                  onChange={(e) => updateSetting('custom_body_scripts', e.target.value)}
                  rows={4}
                  description="Verranno inseriti prima della chiusura del tag body"
                  styles={{ input: { fontFamily: 'monospace', fontSize: 12 } }}
                />
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Asset Picker Drawer */}
      <AssetPickerDrawer
        opened={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={handleAssetSelect}
        title={assetPickerTarget === 'logo' ? 'Seleziona Logo' : 'Seleziona Favicon'}
        filterImages={true}
      />
    </Container>
  );
}
