'use client';

import { useState, useEffect } from 'react';
import { Group, Menu, UnstyledButton, Collapse, Stack } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './navbar.module.css';
import mobileClasses from './navbarClient.module.css';

interface MenuItem {
  id: number;
  label: string;
  href: string;
  parent_id: number | null;
  order_index: number;
  visible: boolean;
  open_in_new_tab: boolean;
  is_dynamic_dropdown: boolean;
  dropdown_source: string | null;
}

interface DynamicDropdownItem {
  id: number;
  slug: string;
  title: string;
}

interface DynamicNavbarProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

// Componente per dropdown dinamico (carica pagine da categoria)
function DynamicDropdown({
  item,
  isMobile,
  onLinkClick
}: {
  item: MenuItem;
  isMobile: boolean;
  onLinkClick?: () => void;
}) {
  const [items, setItems] = useState<DynamicDropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Mappa dropdown_source alla categoria/endpoint corretto
        let endpoint = '/api/eventi?category=evento';
        if (item.dropdown_source === 'vetrina') {
          endpoint = '/api/eventi?category=vetrina';
        } else if (item.dropdown_source === 'eventi') {
          endpoint = '/api/eventi?category=evento';
        }

        const response = await fetch(endpoint);
        const data = await response.json();
        setItems(data.events || []);
      } catch (error) {
        console.error('Error fetching dropdown items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [item.dropdown_source]);

  if (loading || items.length === 0) {
    return null;
  }

  // Determina il prefisso URL basato sulla sorgente
  const getItemUrl = (slug: string) => {
    if (item.dropdown_source === 'vetrina') {
      return `/vetrina/${slug}`;
    }
    return `/eventi/${slug}`;
  };

  // Versione mobile con Collapse
  if (isMobile) {
    return (
      <div>
        <UnstyledButton
          onClick={() => setMobileOpen(!mobileOpen)}
          className={mobileClasses.link}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
        >
          {item.label}
          <IconChevronDown
            size={16}
            style={{
              transform: mobileOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms ease',
            }}
          />
        </UnstyledButton>
        <Collapse in={mobileOpen}>
          <Stack gap="sm" pl="md" mt="xs">
            {items.map((dropdownItem) => (
              <Link
                key={dropdownItem.id}
                href={getItemUrl(dropdownItem.slug)}
                className={mobileClasses.link}
                style={{ fontSize: '0.9rem' }}
                onClick={onLinkClick}
              >
                {dropdownItem.title}
              </Link>
            ))}
          </Stack>
        </Collapse>
      </div>
    );
  }

  // Versione desktop con Menu dropdown
  return (
    <Menu
      trigger="hover"
      openDelay={100}
      closeDelay={200}
      position="bottom-start"
      offset={5}
    >
      <Menu.Target>
        <UnstyledButton className={classes.dropdownTrigger}>
          {item.label.toUpperCase()}
          <IconChevronDown size={14} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className={classes.dropdown}>
        {items.map((dropdownItem) => (
          <Menu.Item
            key={dropdownItem.id}
            component={Link}
            href={getItemUrl(dropdownItem.slug)}
            className={classes.dropdownLink}
          >
            {dropdownItem.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

// Componente per sottomenu statico
function StaticDropdown({
  item,
  children,
  isMobile,
  onLinkClick
}: {
  item: MenuItem;
  children: MenuItem[];
  isMobile: boolean;
  onLinkClick?: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (children.length === 0) return null;

  // Versione mobile
  if (isMobile) {
    return (
      <div>
        <UnstyledButton
          onClick={() => setMobileOpen(!mobileOpen)}
          className={mobileClasses.link}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
        >
          {item.label}
          <IconChevronDown
            size={16}
            style={{
              transform: mobileOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms ease',
            }}
          />
        </UnstyledButton>
        <Collapse in={mobileOpen}>
          <Stack gap="sm" pl="md" mt="xs">
            {children.filter(c => c.visible).map((child) => (
              <Link
                key={child.id}
                href={child.href}
                className={mobileClasses.link}
                style={{ fontSize: '0.9rem' }}
                onClick={onLinkClick}
                target={child.open_in_new_tab ? '_blank' : undefined}
              >
                {child.label}
              </Link>
            ))}
          </Stack>
        </Collapse>
      </div>
    );
  }

  // Versione desktop
  return (
    <Menu
      trigger="hover"
      openDelay={100}
      closeDelay={200}
      position="bottom-start"
      offset={5}
    >
      <Menu.Target>
        <UnstyledButton className={classes.dropdownTrigger}>
          {item.label.toUpperCase()}
          <IconChevronDown size={14} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className={classes.dropdown}>
        {children.filter(c => c.visible).map((child) => (
          <Menu.Item
            key={child.id}
            component={Link}
            href={child.href}
            className={classes.dropdownLink}
            target={child.open_in_new_tab ? '_blank' : undefined}
          >
            {child.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

// Componente principale che renderizza un singolo item del menu
function NavItem({
  item,
  allItems,
  isMobile,
  onLinkClick
}: {
  item: MenuItem;
  allItems: MenuItem[];
  isMobile: boolean;
  onLinkClick?: () => void;
}) {
  const children = allItems.filter(i => i.parent_id === item.id && i.visible);

  // Dropdown dinamico (carica da database)
  if (item.is_dynamic_dropdown) {
    return <DynamicDropdown item={item} isMobile={isMobile} onLinkClick={onLinkClick} />;
  }

  // Ha figli statici -> dropdown statico
  if (children.length > 0) {
    return <StaticDropdown item={item} children={children} isMobile={isMobile} onLinkClick={onLinkClick} />;
  }

  // Link semplice
  if (isMobile) {
    return (
      <Link
        href={item.href}
        className={mobileClasses.link}
        onClick={onLinkClick}
        target={item.open_in_new_tab ? '_blank' : undefined}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={classes.link}
      target={item.open_in_new_tab ? '_blank' : undefined}
    >
      {item.label.toUpperCase()}
    </Link>
  );
}

// Componente esportato che carica e renderizza tutto il menu
export default function DynamicNavbar({ isMobile = false, onLinkClick }: DynamicNavbarProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data.map((item: any) => ({
            ...item,
            visible: Boolean(item.visible),
            open_in_new_tab: Boolean(item.open_in_new_tab),
            is_dynamic_dropdown: Boolean(item.is_dynamic_dropdown)
          })));
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return null;
  }

  // Filtra solo le voci principali (senza parent) e visibili
  const rootItems = menuItems
    .filter(item => !item.parent_id && item.visible)
    .sort((a, b) => a.order_index - b.order_index);

  if (isMobile) {
    return (
      <Stack gap="xl">
        {rootItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            allItems={menuItems}
            isMobile={true}
            onLinkClick={onLinkClick}
          />
        ))}
      </Stack>
    );
  }

  return (
    <Group gap={5}>
      {rootItems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          allItems={menuItems}
          isMobile={false}
        />
      ))}
    </Group>
  );
}
