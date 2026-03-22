"use client";

import { useRef } from "react";
import type { Product } from "@/types";

interface TicketPrintProps {
  products: Product[];
  storeName?: string;
  storePhone?: string;
}

export default function TicketPrint({
  products,
  storeName = "Globival & Detalles",
  storePhone = "967 411 110",
}: TicketPrintProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const w = 650;
    const h = 700;
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 2;
    const printWindow = window.open("", "_blank", `width=${w},height=${h},left=${left},top=${top}`);
    if (!printWindow) return;

    const now = new Date();
    const fecha = now.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora = now.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const total = products.reduce((sum, p) => {
      const price = p.precio_de_oferta && p.precio_de_oferta !== ""
        ? Number(p.precio_de_oferta)
        : Number(p.price);
      return sum + price;
    }, 0);

    const productRows = products
      .map((p) => {
        const price = p.precio_de_oferta && p.precio_de_oferta !== ""
          ? Number(p.precio_de_oferta)
          : Number(p.price);
        return `
          <tr>
            <td style="padding:4px 0;font-size:12px;border-bottom:1px dashed #ddd;">${p.name}</td>
            <td style="padding:4px 0;font-size:12px;text-align:right;border-bottom:1px dashed #ddd;white-space:nowrap;">S/ ${price.toFixed(2)}</td>
          </tr>
        `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket - ${storeName}</title>
        <style>
          @page { margin: 0; size: 80mm auto; }
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 12px;
            width: 280px;
            color: #000;
            background: #fff;
          }
          .header { text-align: center; margin-bottom: 8px; }
          .logo { width: 50px; height: 50px; margin: 0 auto 6px; }
          .logo img { width: 100%; height: 100%; object-fit: contain; }
          .store-name { font-size: 16px; font-weight: bold; margin: 0; }
          .store-sub { font-size: 10px; color: #666; margin: 2px 0; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
          .info { font-size: 10px; color: #666; }
          table { width: 100%; border-collapse: collapse; }
          .total-row td { padding: 6px 0; font-size: 14px; font-weight: bold; border-top: 2px solid #000; }
          .footer { text-align: center; font-size: 10px; color: #888; margin-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <img src="/logo_globival.png" alt="Logo" />
          </div>
          <p class="store-name">${storeName}</p>
          <p class="store-sub">TIENDA DE REGALOS</p>
          <p class="store-sub">Tel: ${storePhone}</p>
        </div>
        <div class="divider"></div>
        <div class="info" style="display:flex;justify-content:space-between;">
          <span>Fecha: ${fecha}</span>
          <span>Hora: ${hora}</span>
        </div>
        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th style="text-align:left;font-size:11px;padding-bottom:4px;">Producto</th>
              <th style="text-align:right;font-size:11px;padding-bottom:4px;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td>TOTAL</td>
              <td style="text-align:right;">S/ ${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        ${products.length > 1 ? `<div class="info" style="text-align:center;margin-top:4px;">${products.length} productos</div>` : ""}
        <div class="divider"></div>
        <div class="footer">
          <p style="margin:2px 0;">Gracias por su compra</p>
          <p style="margin:2px 0;">globival.detalles@gmail.com</p>
          <p style="margin:2px 0;">instagram: @globival.detalles</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return { handlePrint };
}

// Hook version for easier use
export function useTicketPrint(storeName?: string, storePhone?: string) {
  const handlePrint = (products: Product[]) => {
    if (products.length === 0) return;

    const name = storeName || "Globival & Detalles";
    const phone = storePhone || "967 411 110";

    const now = new Date();
    const fecha = now.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora = now.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const total = products.reduce((sum, p) => {
      const price =
        p.precio_de_oferta && p.precio_de_oferta !== ""
          ? Number(p.precio_de_oferta)
          : Number(p.price);
      return sum + price;
    }, 0);

    const productRows = products
      .map((p) => {
        const price =
          p.precio_de_oferta && p.precio_de_oferta !== ""
            ? Number(p.precio_de_oferta)
            : Number(p.price);
        return `
          <tr>
            <td style="padding:4px 0;font-size:12px;border-bottom:1px dashed #ddd;">${p.name}</td>
            <td style="padding:4px 0;font-size:12px;text-align:right;border-bottom:1px dashed #ddd;white-space:nowrap;">S/ ${price.toFixed(2)}</td>
          </tr>`;
      })
      .join("");

    const w = 650;
    const h = 700;
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 2;
    const printWindow = window.open("", "_blank", `width=${w},height=${h},left=${left},top=${top}`);
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Ticket - ${name}</title>
  <style>
    /* Responsive: se adapta al papel que seleccione el usuario */
    @page { margin: 10mm; size: auto; }

    body {
      font-family: 'Segoe UI', 'Courier New', monospace;
      margin: 0;
      padding: 0;
      color: #000;
      background: #fff;
    }

    .ticket {
      max-width: 400px;
      margin: 0 auto;
      padding: 16px;
    }

    /* En pantalla: preview bonito con borde */
    @media screen {
      body { background: #f0f0f0; padding: 20px; }
      .ticket {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        padding: 24px;
      }
    }

    /* Al imprimir: sin bordes, se adapta al papel */
    @media print {
      body { background: #fff; padding: 0; }
      .ticket {
        max-width: 100%;
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
      }
    }

    .header { text-align: center; margin-bottom: 12px; }
    .logo { width: 60px; height: 60px; margin: 0 auto 8px; }
    .logo img { width: 100%; height: 100%; object-fit: contain; }
    .store-name { font-size: 18px; font-weight: bold; margin: 0; }
    .store-sub { font-size: 11px; color: #666; margin: 2px 0; }
    .divider { border-top: 1px dashed #999; margin: 10px 0; }
    .info { font-size: 11px; color: #555; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 12px; padding-bottom: 6px; }
    td { padding: 5px 0; font-size: 13px; }
    tbody td { border-bottom: 1px dashed #ddd; }
    .total-row td { padding: 8px 0; font-size: 16px; font-weight: bold; border-top: 2px solid #000; border-bottom: none; }
    .footer { text-align: center; font-size: 10px; color: #888; margin-top: 14px; }
    .print-hint { text-align: center; margin-top: 16px; font-size: 12px; color: #999; }
    @media print { .print-hint { display: none; } }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div class="logo"><img src="/logo_globival.png" alt="Logo" /></div>
      <p class="store-name">${name}</p>
      <p class="store-sub">TIENDA DE REGALOS</p>
      <p class="store-sub">Tel: ${phone}</p>
    </div>
    <div class="divider"></div>
    <div class="info" style="display:flex;justify-content:space-between;">
      <span>Fecha: ${fecha}</span>
      <span>Hora: ${hora}</span>
    </div>
    <div class="divider"></div>
    <table>
      <thead><tr>
        <th style="text-align:left;">Producto</th>
        <th style="text-align:right;">Precio</th>
      </tr></thead>
      <tbody>${productRows}</tbody>
      <tfoot><tr class="total-row">
        <td>TOTAL</td>
        <td style="text-align:right;">S/ ${total.toFixed(2)}</td>
      </tr></tfoot>
    </table>
    ${products.length > 1 ? `<div class="info" style="text-align:center;margin-top:6px;">${products.length} productos</div>` : ""}
    <div class="divider"></div>
    <div class="footer">
      <p style="margin:3px 0;">Gracias por su compra</p>
      <p style="margin:3px 0;">globival.detalles@gmail.com</p>
      <p style="margin:3px 0;">instagram: @globival.detalles</p>
    </div>
    <p class="print-hint">El ticket se ajusta al papel de tu impresora (A4, carta, ticketera 80mm, etc.)</p>
  </div>
  <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return handlePrint;
}
