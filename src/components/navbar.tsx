import { Image } from '@mantine/core';
import classes from './navbar.module.css';
import Link from "next/link";
import NavbarClient from "@/components/navbarClient";
import DynamicNavbar from "@/components/DynamicNavbar";

export default function Navbar() {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <NavbarClient />

        <Link href="/">
          <Image src={'/logo.svg'} alt={'Sassi Arredamenti'} w={107}/>
        </Link>

        <div className={classes.links}>
          <DynamicNavbar />
        </div>
      </div>
    </header>
  );
}