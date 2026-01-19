'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Title,
  Button,
  Stack,
  Group,
  Text,
  TextInput,
  Modal,
  ActionIcon,
  Paper,
  Alert,
  Box,
  Grid,
  Card,
  Image,
  Breadcrumbs,
  Anchor,
  Progress,
  CopyButton,
  Loader,
  Menu,
  Select,
  Badge,
  SegmentedControl,
  NumberInput,
} from '@mantine/core';
import {
  IconUpload,
  IconTrash,
  IconFolder,
  IconFolderPlus,
  IconPhoto,
  IconFile,
  IconInfoCircle,
  IconCheck,
  IconCopy,
  IconDownload,
  IconHome,
  IconRefresh,
  IconDotsVertical,
  IconExternalLink,
  IconSearch,
  IconX,
  IconTransform,
  IconResize,
  IconAlertTriangle,
  IconReplace,
  IconPencil,
} from '@tabler/icons-react';
import { notifications } from "@mantine/notifications";

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface BlobResponse {
  blobs: BlobFile[];
  folders: string[];
  cursor?: string;
  hasMore: boolean;
  prefix: string;
}

interface UsagePoint {
  type: 'page' | 'section';
  pageId: number;
  pageTitle: string;
  pageSlug: string;
  field: string;
  sectionId?: number;
  sectionType?: string;
}

interface UsageCheckResult {
  url: string;
  inUse: boolean;
  usageCount: number;
  usagePoints: UsagePoint[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(pathname: string) {
  const ext = pathname.split('.').pop()?.toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];
  if (imageExts.includes(ext || '')) {
    return <IconPhoto size={48} stroke={1} color="#228be6" />;
  }
  return <IconFile size={48} stroke={1} color="#868e96" />;
}

function isImageFile(pathname: string): boolean {
  const ext = pathname.split('.').pop()?.toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExts.includes(ext || '');
}

function getFileName(pathname: string): string {
  return pathname.split('/').pop() || pathname;
}

function getFileNameWithoutExt(pathname: string): string {
  const name = getFileName(pathname);
  return name.replace(/\.[^/.]+$/, '');
}

function getFileExtension(pathname: string): string {
  const ext = pathname.split('.').pop()?.toLowerCase() || '';
  return ext.toUpperCase();
}

function canConvertImage(pathname: string): boolean {
  const ext = pathname.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '');
}

function canConvertToWebP(pathname: string): boolean {
  const ext = pathname.split('.').pop()?.toLowerCase();
  // Non mostrare converti in WebP se è già WebP
  return ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '');
}

export default function AdminAssetsPage() {
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [deleteModal, setDeleteModal] = useState<BlobFile | null>(null);
  const [previewModal, setPreviewModal] = useState<BlobFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [recentlyUploaded, setRecentlyUploaded] = useState<string[]>([]);
  const [gridCols, setGridCols] = useState<number>(6); // items per row (12/6=2 cols on lg)
  const [convertModal, setConvertModal] = useState<BlobFile | null>(null);
  const [resizeModal, setResizeModal] = useState<BlobFile | null>(null);
  const [resizeWidth, setResizeWidth] = useState<number | ''>('');
  const [resizeHeight, setResizeHeight] = useState<number | ''>('');
  const [transforming, setTransforming] = useState(false);
  const [usageCheckLoading, setUsageCheckLoading] = useState(false);
  const [usageResult, setUsageResult] = useState<UsageCheckResult | null>(null);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState<'check' | 'confirm' | 'final'>('check');
  const [replaceModal, setReplaceModal] = useState(false);
  const [allFiles, setAllFiles] = useState<BlobFile[]>([]); // Per il picker di sostituzione
  const [renameModal, setRenameModal] = useState<BlobFile | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [replacingUrl, setReplacingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Grid column options: value is the span on lg screens, imageHeight is preview height
  const GRID_OPTIONS = [
    { cols: 2, span: 6, imageHeight: 280 },   // 12/6 = 2 items per row - large images
    { cols: 3, span: 4, imageHeight: 200 },   // 12/4 = 3 items per row
    { cols: 4, span: 3, imageHeight: 150 },   // 12/3 = 4 items per row
    { cols: 6, span: 2, imageHeight: 120 },   // 12/2 = 6 items per row - small images
  ];

  const getGridSpan = () => {
    const option = GRID_OPTIONS.find(o => o.cols === gridCols);
    return option ? option.span : 2;
  };

  const getImageHeight = () => {
    const option = GRID_OPTIONS.find(o => o.cols === gridCols);
    return option ? option.imageHeight : 120;
  };

  // Format options for filter
  const FORMAT_OPTIONS = [
    { value: 'all', label: 'Tutti' },
    { value: 'images', label: 'Immagini' },
    { value: 'documents', label: 'Documenti' },
    { value: 'other', label: 'Altri' },
  ];

  const getFileFormat = (pathname: string): string => {
    const ext = pathname.split('.').pop()?.toLowerCase() || '';
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff'];
    const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];

    if (imageExts.includes(ext)) return 'images';
    if (docExts.includes(ext)) return 'documents';
    return 'other';
  };

  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      // Search filter
      const fileName = getFileName(file.pathname).toLowerCase();
      const matchesSearch = searchQuery === '' || fileName.includes(searchQuery.toLowerCase());

      // Format filter
      const matchesFormat = formatFilter === 'all' || getFileFormat(file.pathname) === formatFilter;

      return matchesSearch && matchesFormat;
    })
    .sort((a, b) => {
      // Recently uploaded files first
      const aRecent = recentlyUploaded.includes(a.url);
      const bRecent = recentlyUploaded.includes(b.url);
      if (aRecent && !bRecent) return -1;
      if (!aRecent && bRecent) return 1;
      // Then sort by upload date (most recent first)
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });

  const currentPrefix = currentPath.length > 0 ? currentPath.join('/') + '/' : '';

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blob?prefix=${encodeURIComponent(currentPrefix)}`);
      const data: BlobResponse = await response.json();
      setFiles(data.blobs.filter(b => !b.pathname.endsWith('.folder')));
      setFolders(data.folders);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPrefix]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (filesToUpload: FileList | File[]) => {
    setUploading(true);
    setUploadProgress(0);
    const totalFiles = filesToUpload.length;
    let completedFiles = 0;
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(filesToUpload)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', currentPrefix.slice(0, -1)); // Rimuovi trailing slash

        const response = await fetch('/api/blob', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.url) {
          uploadedUrls.push(result.url);
        }

        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);
      }

      // Track recently uploaded files to show them first
      setRecentlyUploaded(prev => [...uploadedUrls, ...prev]);

      // Clear recently uploaded marker after 30 seconds
      setTimeout(() => {
        setRecentlyUploaded(prev => prev.filter(url => !uploadedUrls.includes(url)));
      }, 30000);

      fetchFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Errore nel caricamento dei file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteClick = async (file: BlobFile) => {
    setDeleteModal(file);
    setConfirmDeleteStep('check');
    setUsageResult(null);
    setUsageCheckLoading(true);

    try {
      const response = await fetch('/api/blob/check-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: file.url }),
      });
      const result: UsageCheckResult = await response.json();
      setUsageResult(result);
      setConfirmDeleteStep(result.inUse ? 'confirm' : 'check');
    } catch (error) {
      console.error('Error checking usage:', error);
      setUsageResult(null);
    } finally {
      setUsageCheckLoading(false);
    }
  };

  const handleDelete = async (file: BlobFile) => {
    try {
      await fetch('/api/blob', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: file.url }),
      });
      setDeleteModal(null);
      setUsageResult(null);
      setConfirmDeleteStep('check');
      fetchFiles();
      notifications.show({
        title: 'Eliminato',
        message: 'Asset eliminato con successo',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      notifications.show({
        title: 'Errore',
        message: 'Errore nell\'eliminazione del file',
        color: 'red',
      });
    }
  };

  const handleOpenReplaceModal = async () => {
    setReplaceModal(true);
    // Carica tutti i file per il picker
    try {
      const response = await fetch('/api/blob?prefix=');
      const data: BlobResponse = await response.json();
      setAllFiles(data.blobs.filter(b => !b.pathname.endsWith('.folder') && isImageFile(b.pathname)));
    } catch (error) {
      console.error('Error loading files for replace:', error);
    }
  };

  const handleReplaceUrl = async (newFile: BlobFile) => {
    if (!deleteModal || !usageResult) return;

    setReplacingUrl(true);
    try {
      const response = await fetch('/api/blob/replace-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldUrl: deleteModal.url,
          newUrl: newFile.url
        }),
      });
      const result = await response.json();

      if (result.success) {
        notifications.show({
          title: 'Sostituzione completata',
          message: `${result.replacedCount} riferimenti aggiornati`,
          color: 'green',
        });
        setReplaceModal(false);
        // Ora elimina l'asset originale
        await handleDelete(deleteModal);
      } else {
        notifications.show({
          title: 'Errore',
          message: result.error || 'Errore nella sostituzione',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Replace error:', error);
      notifications.show({
        title: 'Errore',
        message: 'Errore nella sostituzione',
        color: 'red',
      });
    } finally {
      setReplacingUrl(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const folderPath = currentPrefix + newFolderName.trim();
      await fetch('/api/blob/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      });
      setNewFolderModal(false);
      setNewFolderName('');
      fetchFiles();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Errore nella creazione della cartella');
    }
  };

  const handleRename = async (file: BlobFile) => {
    if (!newFileName.trim()) {
      notifications.show({
        title: 'Errore',
        message: 'Inserisci un nome valido',
        color: 'red',
      });
      return;
    }

    setRenaming(true);
    try {
      const response = await fetch('/api/blob/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: file.url,
          newName: newFileName.trim(),
        }),
      });
      const result = await response.json();

      if (result.success) {
        // Aggiorna anche i riferimenti nel database se l'asset è in uso
        const usageResponse = await fetch('/api/blob/check-usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: file.url }),
        });
        const usageData = await usageResponse.json();

        if (usageData.inUse) {
          // Aggiorna i riferimenti nel database
          await fetch('/api/blob/replace-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              oldUrl: file.url,
              newUrl: result.newUrl,
            }),
          });
        }

        setRecentlyUploaded(prev => [result.newUrl, ...prev]);
        fetchFiles();
        setRenameModal(null);
        setNewFileName('');
        notifications.show({
          title: 'Rinominato',
          message: `File rinominato in ${result.newName}`,
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'Errore',
          message: result.error || 'Errore nella rinomina',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Rename error:', error);
      notifications.show({
        title: 'Errore',
        message: 'Errore nella rinomina',
        color: 'red',
      });
    } finally {
      setRenaming(false);
    }
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const handleConvertToWebP = async (file: BlobFile) => {
    setTransforming(true);
    try {
      const response = await fetch('/api/blob/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: file.url,
          action: 'convert',
          options: { format: 'webp', quality: 80 },
        }),
      });
      const result = await response.json();
      if (result.success) {
        setRecentlyUploaded(prev => [result.url, ...prev]);
        fetchFiles();
        setConvertModal(null);
        notifications.show({
          title: 'Conversione completata!',
          message: `Risparmio: ${result.savings}%`,
        })
      } else {
        alert(result.error || 'Errore nella conversione');
      }
    } catch (error) {
      console.error('Convert error:', error);
      alert('Errore nella conversione');
    } finally {
      setTransforming(false);
    }
  };

  const handleResize = async (file: BlobFile) => {
    if (!resizeWidth && !resizeHeight) {
      alert('Specifica almeno larghezza o altezza');
      return;
    }
    setTransforming(true);
    try {
      const response = await fetch('/api/blob/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: file.url,
          action: 'resize',
          options: {
            width: resizeWidth || undefined,
            height: resizeHeight || undefined,
            fit: 'inside',
          },
        }),
      });
      const result = await response.json();
      if (result.success) {
        setRecentlyUploaded(prev => [result.url, ...prev]);
        fetchFiles();
        setResizeModal(null);
        setResizeWidth('');
        setResizeHeight('');
        alert(`Ridimensionamento completato! Nuova dimensione: ${formatFileSize(result.size)}`);
      } else {
        alert(result.error || 'Errore nel ridimensionamento');
      }
    } catch (error) {
      console.error('Resize error:', error);
      alert('Errore nel ridimensionamento');
    } finally {
      setTransforming(false);
    }
  };

  const handleDownload = async (file: BlobFile) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getFileName(file.pathname);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      window.open(file.url, '_blank');
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header compatto */}
        <Group justify="space-between" mb="xs">
          <Title order={3}>Gestione Assets</Title>
          <Group gap="xs">
            <Button
              leftSection={<IconFolderPlus size={16} />}
              variant="light"
              size="sm"
              onClick={() => setNewFolderModal(true)}
            >
              Cartella
            </Button>
            <Button
              leftSection={<IconUpload size={16} />}
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Carica
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
          </Group>
        </Group>

        {/* Breadcrumbs + Search inline */}
        <Group gap="md" align="center">
          <Group gap="xs" style={{ flex: 1 }}>
            <ActionIcon variant="subtle" size="sm" onClick={() => navigateToBreadcrumb(-1)}>
              <IconHome size={16} />
            </ActionIcon>
            <Breadcrumbs>
              <Anchor size="sm" onClick={() => navigateToBreadcrumb(-1)} style={{ cursor: 'pointer' }}>
                Root
              </Anchor>
              {currentPath.map((folder, index) => (
                <Anchor
                  key={index}
                  size="sm"
                  onClick={() => navigateToBreadcrumb(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {folder}
                </Anchor>
              ))}
            </Breadcrumbs>
          </Group>
          <TextInput
            placeholder="Cerca..."
            leftSection={<IconSearch size={14} />}
            rightSection={
              searchQuery && (
                <ActionIcon variant="subtle" size="xs" onClick={() => setSearchQuery('')}>
                  <IconX size={12} />
                </ActionIcon>
              )
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="xs"
            w={200}
          />
          <SegmentedControl
            value={formatFilter}
            onChange={setFormatFilter}
            data={FORMAT_OPTIONS}
            size="xs"
          />
          <ActionIcon variant="subtle" size="sm" onClick={fetchFiles} loading={loading}>
            <IconRefresh size={16} />
          </ActionIcon>
        </Group>

        {(searchQuery || formatFilter !== 'all') && (
          <Group gap="xs">
            <Badge variant="light" color="blue" size="sm">
              {filteredFiles.length} file
            </Badge>
            <Button
              variant="subtle"
              size="xs"
              onClick={() => {
                setSearchQuery('');
                setFormatFilter('all');
              }}
            >
              Reset
            </Button>
          </Group>
        )}

        {/* Upload Progress */}
        {uploading && (
          <Progress value={uploadProgress} animated size="sm" />
        )}

        {/* Drop Zone */}
        <Paper
          shadow="xs"
          p="md"
          radius="md"
          withBorder
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            minHeight: 300,
            backgroundColor: isDragging ? 'rgba(34, 139, 230, 0.1)' : undefined,
            border: isDragging ? '2px dashed #228be6' : undefined,
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? (
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Loader size="lg" />
            </Box>
          ) : folders.length === 0 && files.length === 0 ? (
            <Alert icon={<IconInfoCircle size={20} />} title="Cartella vuota" color="blue">
              <Text size="sm">
                Trascina qui i file per caricarli, oppure usa il pulsante "Carica File".
              </Text>
            </Alert>
          ) : folders.length === 0 && filteredFiles.length === 0 && (searchQuery || formatFilter !== 'all') ? (
            <Alert icon={<IconInfoCircle size={20} />} title="Nessun risultato" color="yellow">
              <Text size="sm">
                Nessun file corrisponde ai filtri selezionati. Prova a modificare la ricerca o i filtri.
              </Text>
            </Alert>
          ) : (
            <Stack gap="md">
              {/* Grid size selector */}
              <Group gap={4} justify="flex-end">
                <Text size="xs" c="dimmed" mr={4}>Colonne:</Text>
                {GRID_OPTIONS.map((option) => (
                  <ActionIcon
                    key={option.cols}
                    size="xs"
                    variant={gridCols === option.cols ? 'filled' : 'subtle'}
                    color={gridCols === option.cols ? 'blue' : 'gray'}
                    onClick={() => setGridCols(option.cols)}
                    title={`${option.cols} per riga`}
                  >
                    <Text size="xs" fw={500}>{option.cols}</Text>
                  </ActionIcon>
                ))}
              </Group>
              <Grid gutter="sm">
              {/* Folders */}
              {folders.map((folder) => (
                <Grid.Col key={folder} span={{ base: 6, sm: 4, md: 3, lg: getGridSpan() }}>
                  <Card
                    shadow="sm"
                    padding="sm"
                    radius="md"
                    withBorder
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => navigateToFolder(folder)}
                  >
                    <IconFolder size={36} stroke={1} color="#fab005" />
                    <Text size="xs" mt="xs" lineClamp={1} title={folder}>
                      {folder}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}

              {/* Files */}
              {filteredFiles.map((file) => (
                <Grid.Col key={file.url} span={{ base: 6, sm: 4, md: 3, lg: getGridSpan() }}>
                  <Card shadow="sm" padding="xs" radius="md" withBorder style={{ position: 'relative' }}>
                    {/* Badge estensione in alto a destra */}
                    <Badge
                      size="xs"
                      variant="filled"
                      color={getFileExtension(file.pathname) === 'WEBP' ? 'green' : 'blue'}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        zIndex: 10,
                        textTransform: 'uppercase',
                        fontSize: 9,
                      }}
                    >
                      {getFileExtension(file.pathname)}
                    </Badge>
                    {recentlyUploaded.includes(file.url) && (
                      <Badge
                        color="teal"
                        size="xs"
                        style={{
                          position: 'absolute',
                          top: 4,
                          left: 4,
                          zIndex: 10,
                        }}
                      >
                        Nuovo
                      </Badge>
                    )}
                    <Card.Section
                      style={{
                        height: getImageHeight(),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPreviewModal(file)}
                    >
                      {isImageFile(file.pathname) ? (
                        <Image
                          src={file.url}
                          alt={getFileName(file.pathname)}
                          fit="contain"
                          h={getImageHeight() - 10}
                        />
                      ) : (
                        getFileIcon(file.pathname)
                      )}
                    </Card.Section>

                    <Group justify="space-between" mt="xs" wrap="nowrap">
                      <Text size="xs" lineClamp={1} style={{ flex: 1 }} title={getFileName(file.pathname)}>
                        {getFileNameWithoutExt(file.pathname)}
                      </Text>
                      <Menu shadow="md" width={180}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" size="xs">
                            <IconDotsVertical size={14} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <CopyButton value={file.url}>
                            {({ copied, copy }) => (
                              <Menu.Item
                                leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                onClick={copy}
                              >
                                {copied ? 'Copiato!' : 'Copia URL'}
                              </Menu.Item>
                            )}
                          </CopyButton>
                          <Menu.Item
                            leftSection={<IconExternalLink size={14} />}
                            component="a"
                            href={file.url}
                            target="_blank"
                          >
                            Apri in nuova tab
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconDownload size={14} />}
                            onClick={() => handleDownload(file)}
                          >
                            Scarica
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconPencil size={14} />}
                            onClick={() => {
                              setRenameModal(file);
                              setNewFileName(getFileNameWithoutExt(file.pathname));
                            }}
                          >
                            Rinomina
                          </Menu.Item>
                          {canConvertImage(file.pathname) && (
                            <>
                              <Menu.Divider />
                              {canConvertToWebP(file.pathname) && (
                                <Menu.Item
                                  leftSection={<IconTransform size={14} />}
                                  onClick={() => setConvertModal(file)}
                                >
                                  Converti in WebP
                                </Menu.Item>
                              )}
                              <Menu.Item
                                leftSection={<IconResize size={14} />}
                                onClick={() => setResizeModal(file)}
                              >
                                Ridimensiona
                              </Menu.Item>
                            </>
                          )}
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDeleteClick(file)}
                          >
                            Elimina
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {formatFileSize(file.size)}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
            </Stack>
          )}
        </Paper>

      </Stack>

      {/* New Folder Modal */}
      <Modal
        opened={newFolderModal}
        onClose={() => setNewFolderModal(false)}
        title="Nuova Cartella"
        size="sm"
      >
        <Stack gap="sm">
          <TextInput
            label="Nome cartella"
            placeholder="es: immagini-eventi"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            size="sm"
          />
          <Group justify="flex-end">
            <Button variant="subtle" size="sm" onClick={() => setNewFolderModal(false)}>
              Annulla
            </Button>
            <Button size="sm" onClick={handleCreateFolder}>
              Crea
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModal !== null}
        onClose={() => {
          setDeleteModal(null);
          setUsageResult(null);
          setConfirmDeleteStep('check');
        }}
        title={usageResult?.inUse ? "Attenzione: Asset in uso" : "Conferma eliminazione"}
        size="md"
      >
        <Stack gap="md">
          {usageCheckLoading ? (
            <Box style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <Loader size="sm" />
            </Box>
          ) : usageResult?.inUse ? (
            <>
              <Alert icon={<IconAlertTriangle size={20} />} color="orange" variant="light">
                <Text size="sm" fw={500}>
                  L&apos;immagine che vuoi cancellare è attualmente utilizzata in {usageResult.usageCount} punt{usageResult.usageCount === 1 ? 'o' : 'i'}:
                </Text>
              </Alert>

              <Paper withBorder p="sm" style={{ maxHeight: 200, overflow: 'auto' }}>
                <Stack gap="xs">
                  {usageResult.usagePoints.map((usage, idx) => (
                    <Group key={idx} gap="xs">
                      <Badge size="xs" variant="light" color={usage.type === 'page' ? 'blue' : 'green'}>
                        {usage.type === 'page' ? 'Pagina' : 'Sezione'}
                      </Badge>
                      <Text size="xs" style={{ flex: 1 }}>
                        <strong>{usage.pageTitle}</strong>
                        {usage.sectionType && ` → ${usage.sectionType}`}
                        <Text component="span" c="dimmed" size="xs"> ({usage.field})</Text>
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>

              {confirmDeleteStep === 'confirm' && (
                <Group justify="flex-end" gap="xs">
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => {
                      setDeleteModal(null);
                      setUsageResult(null);
                      setConfirmDeleteStep('check');
                    }}
                  >
                    Annulla
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    leftSection={<IconReplace size={14} />}
                    onClick={handleOpenReplaceModal}
                  >
                    Sostituisci con...
                  </Button>
                  <Button
                    color="orange"
                    size="sm"
                    onClick={() => setConfirmDeleteStep('final')}
                  >
                    Elimina comunque
                  </Button>
                </Group>
              )}

              {confirmDeleteStep === 'final' && (
                <Alert color="red" variant="light">
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>
                      Sei definitivamente sicuro di voler eliminare questo asset?
                    </Text>
                    <Text size="xs" c="dimmed">
                      I riferimenti all&apos;immagine nelle pagine non saranno aggiornati automaticamente.
                    </Text>
                    <Group justify="flex-end" gap="xs" mt="xs">
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => setConfirmDeleteStep('confirm')}
                      >
                        Indietro
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        onClick={() => deleteModal && handleDelete(deleteModal)}
                      >
                        Conferma eliminazione
                      </Button>
                    </Group>
                  </Stack>
                </Alert>
              )}
            </>
          ) : (
            <>
              <Text size="sm">
                Eliminare <strong>{deleteModal && getFileName(deleteModal.pathname)}</strong>?
              </Text>
              {usageResult && !usageResult.inUse && (
                <Alert color="green" variant="light" icon={<IconCheck size={16} />}>
                  <Text size="xs">L&apos;asset non è utilizzato in nessuna pagina.</Text>
                </Alert>
              )}
              <Group justify="flex-end">
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setDeleteModal(null);
                    setUsageResult(null);
                  }}
                >
                  Annulla
                </Button>
                <Button color="red" size="sm" onClick={() => deleteModal && handleDelete(deleteModal)}>
                  Elimina
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Modal>

      {/* Replace Asset Modal */}
      <Modal
        opened={replaceModal}
        onClose={() => setReplaceModal(false)}
        title="Scegli l'asset sostitutivo"
        size="xl"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Seleziona un nuovo asset che sostituirà l&apos;immagine in tutti i {usageResult?.usageCount || 0} punti di utilizzo.
          </Text>

          {replacingUrl ? (
            <Box style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <Loader size="lg" />
            </Box>
          ) : (
            <Grid gutter="sm" style={{ maxHeight: 400, overflow: 'auto' }}>
              {allFiles
                .filter(f => f.url !== deleteModal?.url)
                .map((file) => (
                  <Grid.Col key={file.url} span={{ base: 6, sm: 4, md: 3 }}>
                    <Card
                      shadow="sm"
                      padding="xs"
                      radius="md"
                      withBorder
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleReplaceUrl(file)}
                    >
                      <Card.Section
                        style={{
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f8f9fa',
                        }}
                      >
                        <Image
                          src={file.url}
                          alt={getFileName(file.pathname)}
                          fit="contain"
                          h={90}
                        />
                      </Card.Section>
                      <Text size="xs" lineClamp={1} mt="xs" ta="center">
                        {getFileNameWithoutExt(file.pathname)}
                      </Text>
                    </Card>
                  </Grid.Col>
                ))}
            </Grid>
          )}

          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setReplaceModal(false)}>
              Annulla
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Preview Modal */}
      <Modal
        opened={previewModal !== null}
        onClose={() => setPreviewModal(null)}
        title={previewModal ? getFileName(previewModal.pathname) : ''}
        size="xl"
      >
        {previewModal && (
          <Stack gap="md">
            {isImageFile(previewModal.pathname) ? (
              <Image
                src={previewModal.url}
                alt={getFileName(previewModal.pathname)}
                fit="contain"
                mah={500}
              />
            ) : (
              <Box style={{ textAlign: 'center', padding: 40 }}>
                {getFileIcon(previewModal.pathname)}
                <Text mt="md">Anteprima non disponibile</Text>
              </Box>
            )}

            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" fw={500}>URL:</Text>
                  <CopyButton value={previewModal.url}>
                    {({ copied, copy }) => (
                      <Button
                        size="xs"
                        variant="light"
                        leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                        onClick={copy}
                      >
                        {copied ? 'Copiato!' : 'Copia URL'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
                <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                  {previewModal.url}
                </Text>

                <Group gap="xl" mt="sm">
                  <Box>
                    <Text size="xs" c="dimmed">Dimensione</Text>
                    <Text size="sm">{formatFileSize(previewModal.size)}</Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Caricato il</Text>
                    <Text size="sm">
                      {new Date(previewModal.uploadedAt).toLocaleDateString('it-IT', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </Box>
                </Group>
              </Stack>
            </Paper>

            <Group justify="flex-end">
              <Button
                variant="light"
                component="a"
                href={previewModal.url}
                target="_blank"
                leftSection={<IconExternalLink size={16} />}
              >
                Apri
              </Button>
              <Button
                variant="light"
                component="a"
                href={previewModal.url}
                download
                leftSection={<IconDownload size={16} />}
              >
                Scarica
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Convert to WebP Modal */}
      <Modal
        opened={convertModal !== null}
        onClose={() => setConvertModal(null)}
        title="Converti in WebP"
        size="sm"
      >
        {convertModal && (
          <Stack gap="md">
            <Text size="sm">
              Convertire <strong>{getFileName(convertModal.pathname)}</strong> in formato WebP?
            </Text>
            <Text size="xs" c="dimmed">
              WebP offre una compressione migliore rispetto a JPEG/PNG, riducendo le dimensioni del file mantenendo la qualità.
            </Text>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setConvertModal(null)}>
                Annulla
              </Button>
              <Button
                onClick={() => handleConvertToWebP(convertModal)}
                loading={transforming}
                leftSection={<IconTransform size={16} />}
              >
                Converti
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Resize Modal */}
      <Modal
        opened={resizeModal !== null}
        onClose={() => {
          setResizeModal(null);
          setResizeWidth('');
          setResizeHeight('');
        }}
        title="Ridimensiona immagine"
        size="sm"
      >
        {resizeModal && (
          <Stack gap="md">
            <Text size="sm">
              Ridimensiona <strong>{getFileName(resizeModal.pathname)}</strong>
            </Text>
            <Text size="xs" c="dimmed">
              Lascia vuoto uno dei campi per mantenere le proporzioni.
            </Text>
            <Group grow>
              <NumberInput
                label="Larghezza (px)"
                placeholder="Auto"
                value={resizeWidth}
                onChange={(val) => setResizeWidth(val as number | '')}
                min={10}
                max={4000}
              />
              <NumberInput
                label="Altezza (px)"
                placeholder="Auto"
                value={resizeHeight}
                onChange={(val) => setResizeHeight(val as number | '')}
                min={10}
                max={4000}
              />
            </Group>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setResizeModal(null)}>
                Annulla
              </Button>
              <Button
                onClick={() => handleResize(resizeModal)}
                loading={transforming}
                leftSection={<IconResize size={16} />}
              >
                Ridimensiona
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Rename Modal */}
      <Modal
        opened={renameModal !== null}
        onClose={() => {
          setRenameModal(null);
          setNewFileName('');
        }}
        title="Rinomina file"
        size="sm"
      >
        {renameModal && (
          <Stack gap="md">
            <Text size="sm">
              Rinomina <strong>{getFileName(renameModal.pathname)}</strong>
            </Text>
            <TextInput
              label="Nuovo nome"
              placeholder="nome-file"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename(renameModal)}
              rightSection={
                <Text size="xs" c="dimmed">
                  .{getFileExtension(renameModal.pathname).toLowerCase()}
                </Text>
              }
              rightSectionWidth={50}
            />
            <Text size="xs" c="dimmed">
              L&apos;estensione verrà mantenuta automaticamente. I riferimenti nel database saranno aggiornati.
            </Text>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setRenameModal(null)}>
                Annulla
              </Button>
              <Button
                onClick={() => handleRename(renameModal)}
                loading={renaming}
                leftSection={<IconPencil size={16} />}
              >
                Rinomina
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
