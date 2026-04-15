"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Settings {
  siteName: string;
  siteDescription: string;
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  contactNumber: string;
}

const defaultSettings: Settings = {
  siteName: "AI Computer Centre",
  siteDescription: "AI-powered digital computer centre delivering online services.",
  brandPrimary: "#0070f3",
  brandSecondary: "#7928ca",
  brandAccent: "#ff0080",
  logoUrl: "",
  faviconUrl: "",
  supportEmail: "support@aicomputercentre.com",
  contactNumber: "+234 812 345 6789",
};

const SettingsContext = createContext<Settings>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    // Apply brand colors to CSS variables
    const root = document.documentElement;
    if (settings.brandPrimary) root.style.setProperty("--brand-primary", settings.brandPrimary);
    if (settings.brandSecondary) root.style.setProperty("--brand-secondary", settings.brandSecondary);
    if (settings.brandAccent) root.style.setProperty("--brand-accent", settings.brandAccent);
  }, [settings]);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
