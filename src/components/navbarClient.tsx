'use client'

import {
  Burger,
  Divider,
  Drawer,
  Group,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DynamicNavbar from "@/components/DynamicNavbar";

export default function NavbarClient() {
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLinkClick = () => {
    setTimeout(close, 400);
  };

  return (
    <>
      <Group hiddenFrom="md">
        <Burger
          opened={opened}
          onClick={toggle}
          color={'white'}
          size="sm"
          hiddenFrom="sm"
        />
      </Group>
      <Drawer
        opened={opened}
        onClose={close}
        zIndex={99999}
        title={'Sassi Arredamenti'}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          <DynamicNavbar isMobile onLinkClick={handleLinkClick} />
        </ScrollArea>
      </Drawer>
    </>
  );
}
