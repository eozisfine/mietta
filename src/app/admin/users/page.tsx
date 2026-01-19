'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  Group,
  ActionIcon,
  Badge,
  Button,
  Modal,
  TextInput,
  PasswordInput,
  Stack,
  Text,
  Tooltip,
  Alert,
  Menu,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconBan,
  IconCheck,
  IconMail,
  IconDotsVertical,
} from '@tabler/icons-react';

interface User {
  id: number;
  email: string;
  role: string;
  enabled: boolean;
  last_login: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword) {
      setError('Email e password sono obbligatori');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Errore nella creazione');
        return;
      }

      setModalOpened(false);
      setNewEmail('');
      setNewPassword('');
      fetchUsers();
      setSuccess('Utente creato con successo');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Errore di connessione');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (userId: number, currentEnabled: boolean) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentEnabled }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;

    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSendResetEmail = async (userId: number, email: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(`Link reset generato per ${email}. Token: ${data.resetToken}`);
        setTimeout(() => setSuccess(''), 10000);
      }
    } catch (error) {
      console.error('Error sending reset:', error);
    }
  };

  return (
    <Container size="lg" py="md">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>Gestione Utenti</Text>
        <Tooltip label="Nuovo utente">
          <ActionIcon variant="light" onClick={() => setModalOpened(true)}>
            <IconPlus size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {success && (
          <Alert color="green" mb="md" withCloseButton onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Paper withBorder radius="sm">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Email</Table.Th>
                <Table.Th>Ruolo</Table.Th>
                <Table.Th>Stato</Table.Th>
                <Table.Th>Ultimo accesso</Table.Th>
                <Table.Th>Creato il</Table.Th>
                <Table.Th w={100}>Azioni</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Center py="xl"><Loader type="dots" size="lg" color="blue" /></Center>
                  </Table.Td>
                </Table.Tr>
              ) : users.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="md">Nessun utente</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                users.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>{user.email}</Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="light">
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        size="sm"
                        color={user.enabled ? 'green' : 'red'}
                        variant="light"
                      >
                        {user.enabled ? 'Attivo' : 'Disabilitato'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleString('it-IT', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Mai'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(user.created_at).toLocaleDateString('it-IT')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={180} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" size="sm">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={user.enabled ? <IconBan size={14} /> : <IconCheck size={14} />}
                            onClick={() => handleToggleEnabled(user.id, user.enabled)}
                          >
                            {user.enabled ? 'Disabilita' : 'Abilita'}
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconMail size={14} />}
                            onClick={() => handleSendResetEmail(user.id, user.email)}
                          >
                            Reset password
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDelete(user.id)}
                          >
                            Elimina
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Paper>

      {/* Modal nuovo utente */}
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setError('');
        }}
        title="Nuovo Utente"
        size="sm"
      >
        <Stack gap="md">
          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="admin@example.com"
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <PasswordInput
            label="Password"
            placeholder="Minimo 8 caratteri"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Annulla
            </Button>
            <Button onClick={handleCreateUser} loading={saving}>
              Crea utente
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
