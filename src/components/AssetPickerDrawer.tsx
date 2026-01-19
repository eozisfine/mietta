'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ActionIcon,
  Drawer,
  Stack,
  Group,
  Text,
  TextInput,
  SegmentedControl,
  Grid,
  Card,
  Image,
  Box,
  Breadcrumbs,
  Anchor,
  Loader,
  Center,
  Paper,
  UnstyledButton,
} from '@mantine/core';
import {
  IconSearch,
  IconFolder,
  IconFile,
  IconChevronLeft,
  IconPhoto,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconFileUnknown,
  IconCircleCheck,
} from '@tabler/icons-react';

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface AssetPickerDrawerProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  filterImages?: boolean; // Solo immagini
}

type FormatFilter = 'all' | 'images' | 'documents' | 'other';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp'];
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

function getFileExtension(pathname: string): string {
  return pathname.split('.').pop()?.toLowerCase() || '';
}

function getFileName(pathname: string): string {
  return pathname.split('/').pop() || pathname;
}

function isImage(pathname: string): boolean {
  return IMAGE_EXTENSIONS.includes(getFileExtension(pathname));
}

function isDocument(pathname: string): boolean {
  return DOCUMENT_EXTENSIONS.includes(getFileExtension(pathname));
}

function getFileIcon(pathname: string) {
  const ext = getFileExtension(pathname);
  if (IMAGE_EXTENSIONS.includes(ext)) return <IconPhoto size={40} color="#228be6" />;
  if (ext === 'pdf') return <IconFileTypePdf size={40} color="#fa5252" />;
  if (['doc', 'docx'].includes(ext)) return <IconFileTypeDoc size={40} color="#228be6" />;
  return <IconFileUnknown size={40} color="#868e96" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function AssetPickerDrawer({
  opened,
  onClose,
  onSelect,
  title = 'Seleziona Immagine',
  filterImages = true,
}: AssetPickerDrawerProps) {
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>(filterImages ? 'images' : 'all');

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const prefix = currentPath.length > 0 ? currentPath.join('/') + '/' : '';
      const response = await fetch(`/api/blob?prefix=${encodeURIComponent(prefix)}`);
      const data = await response.json();
      setFiles(data.blobs || []);
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPath]);

  useEffect(() => {
    if (opened) {
      fetchFiles();
    }
  }, [opened, fetchFiles]);

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const navigateToIndex = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  // Filtra i file
  const filteredFiles = files.filter((file) => {
    const fileName = getFileName(file.pathname).toLowerCase();
    const matchesSearch = fileName.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (formatFilter) {
      case 'images':
        return isImage(file.pathname);
      case 'documents':
        return isDocument(file.pathname);
      case 'other':
        return !isImage(file.pathname) && !isDocument(file.pathname);
      default:
        return true;
    }
  });

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={title}
      position="right"
      size="lg"
      padding="md"
    >
      <Stack gap="md" h="calc(100vh - 100px)">
        {/* Breadcrumb navigazione */}
        <Paper p="xs" withBorder>
          <Group gap="xs">
            {currentPath.length > 0 && (
              <ActionIcon variant="subtle" onClick={navigateBack} size="sm">
                <IconChevronLeft size={16} />
              </ActionIcon>
            )}
            <Breadcrumbs separator="/">
              <Anchor
                size="sm"
                onClick={() => setCurrentPath([])}
                style={{ cursor: 'pointer' }}
              >
                Root
              </Anchor>
              {currentPath.map((folder, index) => (
                <Anchor
                  key={index}
                  size="sm"
                  onClick={() => navigateToIndex(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {folder}
                </Anchor>
              ))}
            </Breadcrumbs>
          </Group>
        </Paper>

        {/* Filtri */}
        <Group gap="xs">
          <TextInput
            placeholder="Cerca file..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            size="sm"
          />
        </Group>

        <SegmentedControl
          value={formatFilter}
          onChange={(value) => setFormatFilter(value as FormatFilter)}
          data={[
            { label: 'Tutti', value: 'all' },
            { label: 'Immagini', value: 'images' },
            { label: 'Documenti', value: 'documents' },
            { label: 'Altri', value: 'other' },
          ]}
          size="xs"
          fullWidth
        />

        {/* Contenuto */}
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <Center h={200}>
              <Loader />
            </Center>
          ) : (
            <Stack gap="sm">
              {/* Cartelle */}
              {folders.length > 0 && (
                <>
                  <Text size="xs" c="dimmed" fw={500}>
                    CARTELLE
                  </Text>
                  <Grid gutter="xs">
                    {folders.map((folder) => (
                      <Grid.Col key={folder} span={6}>
                        <Card
                          padding="sm"
                          withBorder
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigateToFolder(folder)}
                        >
                          <Group gap="xs">
                            <IconFolder size={20} color="#fab005" />
                            <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
                              {folder}
                            </Text>
                          </Group>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                </>
              )}

              {/* File */}
              {filteredFiles.length > 0 && (
                <>
                  <Text size="xs" c="dimmed" fw={500} mt="sm">
                    FILE ({filteredFiles.length})
                  </Text>
                  <style>{`
                    .asset-card {
                      cursor: pointer;
                      position: relative;
                      transition: transform 0.15s ease, box-shadow 0.15s ease;
                    }
                    .asset-card:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                    .asset-card:hover .select-overlay {
                      opacity: 1;
                    }
                    .select-overlay {
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      background: rgba(34, 139, 230, 0.15);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      opacity: 0;
                      transition: opacity 0.15s ease;
                      border-radius: 4px;
                      pointer-events: none;
                    }
                  `}</style>
                  <Grid gutter="xs">
                    {filteredFiles.map((file) => (
                      <Grid.Col key={file.url} span={6}>
                        <Card
                          className="asset-card"
                          padding="xs"
                          withBorder
                          onClick={() => handleSelect(file.url)}
                        >
                          <Box style={{ position: 'relative' }}>
                            {isImage(file.pathname) ? (
                              <Image
                                src={file.url}
                                alt={getFileName(file.pathname)}
                                h={100}
                                fit="cover"
                                radius="sm"
                              />
                            ) : (
                              <Center h={100} bg="gray.1" style={{ borderRadius: 4 }}>
                                {getFileIcon(file.pathname)}
                              </Center>
                            )}
                            <div className="select-overlay">
                              <IconCircleCheck size={32} color="#228be6" />
                            </div>
                          </Box>
                          <Stack gap={2} mt="xs">
                            <Text size="xs" fw={500} lineClamp={1}>
                              {getFileName(file.pathname)}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {formatFileSize(file.size)}
                            </Text>
                          </Stack>
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                </>
              )}

              {/* Nessun risultato */}
              {folders.length === 0 && filteredFiles.length === 0 && (
                <Center h={200}>
                  <Stack align="center" gap="xs">
                    <IconFile size={40} color="#868e96" />
                    <Text c="dimmed" size="sm">
                      Nessun file trovato
                    </Text>
                  </Stack>
                </Center>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Drawer>
  );
}
