"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingWhatsApp() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch settings for WhatsApp:", error);
      }
    }
    fetchSettings();
  }, []);

  const phoneNumber = settings.contactNumber?.replace(/[^0-9]/g, "") || "2348123456789";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={30} fill="currentColor" />
      <span className="absolute right-full mr-4 bg-white text-[#075E54] px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none border border-gray-100">
        Chat with us!
      </span>
    </a>
  );
}
