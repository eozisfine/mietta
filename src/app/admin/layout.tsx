'use client';

import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Menu,
  Paper,
  Text,
  Tooltip
} from '@mantine/core';
import {
  IconBook,
  IconDatabase,
  IconFiles,
  IconGitBranch,
  IconInbox,
  IconLogout,
  IconMenu2,
  IconPhoto,
  IconRoute,
  IconSettings,
  IconUser,
  IconUsers
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
                                      children,
                                    }: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Non mostrare navbar nella pagina login
  if ( pathname === '/admin/login' ) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  const NavLink = ({ href, icon: Icon, label }: {
    href: string;
    icon: any;
    label: string
  }) => {
    const isActive = pathname.startsWith(href);
    return (
        <Tooltip label={label}>
          <ActionIcon
              component={Link}
              href={href}
              variant={isActive ? 'light' : 'subtle'}
              size="sm"
          >
            <Icon size={16}/>
          </ActionIcon>
        </Tooltip>
    );
  };

  return (
      <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Paper
            shadow="xs"
            px="sm"
            py={6}
            radius={0}
            style={{
              borderBottom: '1px solid #e9ecef',
              position: 'sticky',
              top: 0,
              zIndex: 100,
              backgroundColor: '#fff',
            }}
        >
          <Group justify="space-between">
            <Group gap="xs">
              <Text size="sm" fw={600} c="blue">Sassi Admin</Text>
              <Divider orientation="vertical" mx={4}/>
              <NavLink href="/admin/pages" icon={IconFiles} label="Pagine"/>
              <NavLink href="/admin/assets" icon={IconPhoto} label="Assets"/>
              <NavLink href="/admin/menu" icon={IconMenu2} label="Menu"/>
              <NavLink href="/admin/contacts" icon={IconInbox} label="Messaggi"/>
              <NavLink href="/admin/redirects" icon={IconRoute} label="Redirect"/>
              <Divider orientation="vertical" mx={4}/>
              <NavLink href="/admin/settings" icon={IconSettings} label="Impostazioni"/>
              <NavLink href="/admin/backup" icon={IconDatabase} label="Backup"/>
              <NavLink href="/admin/users" icon={IconUsers} label="Utenti"/>
              <NavLink href="/admin/guide" icon={IconBook} label="Guida"/>
              <NavLink href="/admin/changelog" icon={IconGitBranch} label="Changelog"/>
            </Group>
            <Menu shadow="md" width={160} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconUser size={16}/>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14}/>}
                    onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Paper>

        <Box style={{ minHeight: 'calc(100vh - 40px)' }}>
          {children}
        </Box>
      </Box>
  );
}
