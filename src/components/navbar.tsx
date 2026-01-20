import { Title } from '@mantine/core';
import classes from './navbar.module.css';
import Link from "next/link";
import NavbarClient from "@/components/navbarClient";
import DynamicNavbar from "@/components/DynamicNavbar";

export default function Navbar() {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <NavbarClient />

        <Link href="/" style={{ textDecoration: 'none' }}>
          <Title
            order={1}
            style={{
              fontFamily: 'var(--font-title), Buda, serif',
              fontSize: '1.8rem',
              fontWeight: 400,
              color: '#4A4A4A',
              letterSpacing: '2px',
            }}
          >
            Mietta Corli
          </Title>
        </Link>

        <div className={classes.links}>
          <DynamicNavbar />
        </div>
      </div>
    </header>
  );
}