"use client";

import Link from "next/link";
import { Instagram, Facebook, Music2, Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { BUSINESS } from "@/config/constants";

const quickLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/social", label: "Social" },
  { href: "/acerca-de", label: "Quiénes Somos" },
  { href: "/contacto", label: "Contacto" },
];

const socialLinks = [
  {
    href: BUSINESS.social.instagram,
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: BUSINESS.social.tiktok,
    icon: Music2,
    label: "TikTok",
  },
  {
    href: BUSINESS.social.facebook,
    icon: Facebook,
    label: "Facebook",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30" role="contentinfo">
      <nav aria-label="Pie de página" className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Tienda de regalos y productos personalizados. Encuentra el detalle
              perfecto para cada ocasion especial.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-accent p-2 text-foreground/60 transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <span>{BUSINESS.email}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <span>{BUSINESS.phoneDisplay}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{BUSINESS.address}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/libro-reclamaciones"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Libro de Reclamaciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Globival Detalles. Todos los derechos
            reservados.
          </p>
        </div>
      </nav>
    </footer>
  );
}
