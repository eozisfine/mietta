'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Center,
  Box,
} from '@mantine/core';
import { IconAlertCircle, IconLock } from '@tabler/icons-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Credenziali non valide');
        return;
      }

      router.push('/admin/pages');
    } catch {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Paper radius="md" p="xl" withBorder shadow="xl" miw={360}>
          <Center mb="md">
            <Box
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconLock size={24} color="white" />
            </Box>
          </Center>

          <Title order={4} ta="center" mb="lg">
            Admin Login
          </Title>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                  {error}
                </Alert>
              )}

              <TextInput
                label="Email"
                placeholder="admin@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
              />

              <PasswordInput
                label="Password"
                placeholder="La tua password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="sm"
              />

              <Button type="submit" fullWidth loading={loading} size="sm" mt="sm">
                Accedi
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
