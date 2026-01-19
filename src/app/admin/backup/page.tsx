'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FileInput,
  Group,
  List,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
  Code
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCheck,
  IconCloudDownload,
  IconCloudUpload,
  IconDatabase,
  IconDownload,
  IconFileImport,
  IconInfoCircle,
  IconUpload
} from '@tabler/icons-react';
import { useState } from 'react';

export default function BackupPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported?: string[];
    errors?: string[];
  } | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleExport = async () => {
    setExporting(true);

    try {
      const res = await fetch('/api/backup?action=export');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Errore export:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelect = async (file: File | null) => {
    setImportFile(file);
    setPreviewData(null);
    setImportResult(null);

    if (file) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        setPreviewData(data);
      } catch {
        setPreviewData({ error: 'File non valido' });
      }
    }
  };

  const handleImport = async () => {
    if (!importFile || !previewData || previewData.error) return;

    setImporting(true);
    setImportResult(null);

    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          data: previewData,
          overwrite
        })
      });

      const result = await res.json();

      if (res.ok) {
        setImportResult({
          success: true,
          imported: result.imported,
          errors: result.errors
        });
        setImportFile(null);
        setPreviewData(null);
      } else {
        setImportResult({
          success: false,
          errors: [result.error || 'Errore sconosciuto']
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        errors: [(error as Error).message]
      });
    } finally {
      setImporting(false);
    }
  };

  const getTableStats = (tables: Record<string, any[]>) => {
    return Object.entries(tables).map(([name, rows]) => ({
      name,
      count: Array.isArray(rows) ? rows.length : 0
    }));
  };

  return (
    <Container size="lg" py="md">
      <Group gap="xs" mb="lg">
        <IconDatabase size={24} />
        <Title order={3}>Backup & Ripristino</Title>
      </Group>

      <Stack gap="lg">
        {/* Sezione Export */}
        <Card withBorder p="lg">
          <Group gap="sm" mb="md">
            <IconCloudDownload size={20} color="var(--mantine-color-blue-6)" />
            <Text fw={600}>Esporta Backup</Text>
          </Group>

          <Text size="sm" c="dimmed" mb="md">
            Scarica un file JSON contenente tutti i dati del sito: pagine, sezioni, menu, impostazioni, messaggi e redirect.
          </Text>

          <Alert icon={<IconInfoCircle size={16} />} color="blue" mb="md">
            Il backup non include i file media (immagini, documenti). Questi sono archiviati su Vercel Blob e non verranno persi.
          </Alert>

          <Button
            leftSection={<IconDownload size={16} />}
            onClick={handleExport}
            loading={exporting}
          >
            Scarica Backup
          </Button>
        </Card>

        {/* Sezione Import */}
        <Card withBorder p="lg">
          <Group gap="sm" mb="md">
            <IconCloudUpload size={20} color="var(--mantine-color-green-6)" />
            <Text fw={600}>Importa Backup</Text>
          </Group>

          <Text size="sm" c="dimmed" mb="md">
            Carica un file di backup JSON per ripristinare i dati. I record esistenti con lo stesso ID non verranno sovrascritti (a meno che non selezioni l'opzione).
          </Text>

          <Alert icon={<IconAlertTriangle size={16} />} color="orange" mb="md">
            L'importazione potrebbe modificare i dati esistenti. Si consiglia di fare un backup prima di procedere.
          </Alert>

          <Stack gap="md">
            <FileInput
              label="File di backup"
              placeholder="Seleziona file .json"
              accept=".json"
              leftSection={<IconFileImport size={16} />}
              value={importFile}
              onChange={handleFileSelect}
            />

            {previewData && !previewData.error && (
              <Paper p="sm" bg="gray.0" withBorder>
                <Text size="sm" fw={500} mb="xs">Anteprima backup:</Text>
                <Text size="xs" c="dimmed" mb="xs">
                  Versione: {previewData.version || 'N/A'} |
                  Data: {previewData.exported_at ? new Date(previewData.exported_at).toLocaleString('it-IT') : 'N/A'}
                </Text>
                <List size="xs" spacing={2}>
                  {previewData.tables && getTableStats(previewData.tables).map(t => (
                    <List.Item key={t.name}>
                      <Code>{t.name}</Code>: {t.count} record
                    </List.Item>
                  ))}
                </List>
              </Paper>
            )}

            {previewData?.error && (
              <Alert color="red" icon={<IconAlertTriangle size={16} />}>
                {previewData.error}
              </Alert>
            )}

            <Checkbox
              label="Sovrascrivi dati esistenti (elimina prima di importare)"
              description="Se selezionato, i dati esistenti nelle tabelle importate verranno eliminati prima dell'import"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.currentTarget.checked)}
              color="orange"
            />

            <Button
              leftSection={<IconUpload size={16} />}
              onClick={handleImport}
              loading={importing}
              disabled={!importFile || !previewData || previewData.error}
              color="green"
            >
              Importa Backup
            </Button>
          </Stack>

          {importResult && (
            <Alert
              mt="md"
              color={importResult.success ? 'green' : 'red'}
              icon={importResult.success ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
            >
              {importResult.success ? (
                <>
                  <Text fw={500}>Import completato!</Text>
                  {importResult.imported && importResult.imported.length > 0 && (
                    <List size="xs" mt="xs">
                      {importResult.imported.map((item, i) => (
                        <List.Item key={i}>{item}</List.Item>
                      ))}
                    </List>
                  )}
                </>
              ) : (
                <>
                  <Text fw={500}>Errore durante l'import</Text>
                  {importResult.errors && (
                    <List size="xs" mt="xs">
                      {importResult.errors.map((err, i) => (
                        <List.Item key={i}>{err}</List.Item>
                      ))}
                    </List>
                  )}
                </>
              )}
            </Alert>
          )}
        </Card>

        {/* Info sulle tabelle */}
        <Card withBorder p="lg">
          <Text fw={600} mb="md">Tabelle incluse nel backup</Text>
          <List size="sm" spacing="xs">
            <List.Item><Code>pages</Code> - Pagine del sito</List.Item>
            <List.Item><Code>page_sections</Code> - Sezioni delle pagine</List.Item>
            <List.Item><Code>page_history</Code> - Cronologia modifiche</List.Item>
            <List.Item><Code>menu_items</Code> - Voci del menu</List.Item>
            <List.Item><Code>site_settings</Code> - Impostazioni globali</List.Item>
            <List.Item><Code>contact_messages</Code> - Messaggi ricevuti</List.Item>
            <List.Item><Code>redirects</Code> - Redirect URL</List.Item>
          </List>
          <Text size="xs" c="dimmed" mt="md">
            Le tabelle utenti e sessioni non sono incluse per motivi di sicurezza.
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}
