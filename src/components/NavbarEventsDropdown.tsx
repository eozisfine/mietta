'use client';

import { useState, useEffect } from 'react';
import { Menu, UnstyledButton, Collapse, Stack } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './navbar.module.css';
import mobileClasses from './navbarClient.module.css';

interface Event {
  id: number;
  slug: string;
  title: string;
}

interface NavbarEventsDropdownProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function NavbarEventsDropdown({ isMobile = false, onLinkClick }: NavbarEventsDropdownProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/eventi?category=evento');
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading || events.length === 0) {
    return null;
  }

  // Mobile version with Collapse
  if (isMobile) {
    return (
      <div>
        <UnstyledButton
          onClick={() => setMobileOpen(!mobileOpen)}
          className={mobileClasses.link}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
        >
          Eventi
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
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/eventi/${event.slug}`}
                className={mobileClasses.link}
                style={{ fontSize: '0.9rem' }}
                onClick={onLinkClick}
              >
                {event.title}
              </Link>
            ))}
          </Stack>
        </Collapse>
      </div>
    );
  }

  // Desktop version with Menu dropdown
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
          EVENTI
          <IconChevronDown size={14} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className={classes.dropdown}>
        {events.map((event) => (
          <Menu.Item
            key={event.id}
            component={Link}
            href={`/eventi/${event.slug}`}
            className={classes.dropdownLink}
          >
            {event.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
