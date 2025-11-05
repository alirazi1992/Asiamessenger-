"use client";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  Circle,
  type LucideIcon,
} from "lucide-react";

export default function RightProfile() {
  return (
    <aside className="border-l bg-[var(--panel)] text-[var(--text)] h-full">
      <div className="p-5 border-b">
        <div className="mx-auto w-24 h-24 relative">
          <Image
            src="/avatar-luffy.jpg"
            alt="Monkey D. Luffy"
            fill
            sizes="96px"
            className="rounded-full border object-cover"
            priority
          />
        </div>
        <div className="text-center mt-3">
          <div className="text-lg font-semibold">Monkey D. Luffy</div>
          <div className="text-[13px] text-[var(--text-dim)]">
            Project Manager
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3 text-sm">
        <InfoItem icon={Mail} text="monkey@jollyroger.ai" />
        <InfoItem icon={Phone} text="+82 50 129 01 35" />
        <InfoItem icon={MapPin} text="Goa, Kingdom" />
        <InfoItem icon={Clock} text="4:41 PM Local Time" />
        <InfoItem icon={Briefcase} text="Design Department" />
        <InfoItem icon={Calendar} text="Date joined: 7 December 2022" />

        <div className="flex items-center gap-2 pt-1">
          <Circle className="w-3 h-3 text-[var(--success)] fill-[var(--success)]" />
          <span className="text-[13px] text-[var(--text-dim)]">Active</span>
        </div>

        <div className="flex gap-2 pt-4">
          <button className="flex-1 h-9 rounded bg-white text-black text-sm">
            Message
          </button>
          <button className="flex-1 h-9 rounded bg-[var(--panel-2)] text-sm">
            Huddle
          </button>
        </div>
      </div>
    </aside>
  );
}

function InfoItem({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[13px]">
      <Icon className="w-4 h-4 opacity-70" />
      <span className="text-[var(--text)]/90">{text}</span>
    </div>
  );
}
