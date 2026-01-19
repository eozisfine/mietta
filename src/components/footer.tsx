'use client';

import { Box, Container, Text } from "@mantine/core";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      style={{
        backgroundColor: '#6B7A8C',
        padding: '40px 0',
      }}
    >
      <Container size="xl">
        <Text
          ta="center"
          c="white"
          style={{
            fontFamily: 'var(--font-title), Buda, serif',
            fontSize: '16px',
          }}
        >
          Copyright &copy; {currentYear} Mietta Corli
        </Text>
      </Container>
    </Box>
  );
}
