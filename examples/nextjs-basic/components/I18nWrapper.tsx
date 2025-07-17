'use client';

import { I18nProvider } from "hua-i18n-sdk";
import { i18nConfig } from "@/lib/i18n-config";

interface I18nWrapperProps {
  children: React.ReactNode;
}

export default function I18nWrapper({ children }: I18nWrapperProps) {
  return (
    <I18nProvider config={i18nConfig}>
      {children}
    </I18nProvider>
  );
} 