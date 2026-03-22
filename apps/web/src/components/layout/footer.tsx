import { COMPANY, NAV_LINKS } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.04)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/logo-orange-white-dark.webp"
              alt="STEADYWRK"
              width={120}
              height={28}
              className="h-6 w-auto opacity-60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[13px] text-white/30">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white/60 transition-colors duration-[180ms] min-h-[44px] inline-flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`mailto:${COMPANY.emails.public}`}
              className="hover:text-white/60 transition-colors duration-[180ms] min-h-[44px] inline-flex items-center"
            >
              {COMPANY.emails.public}
            </a>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15">
            &copy; 2026 {COMPANY.legal}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/privacy"
              className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-[180ms] min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-[180ms] min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              Terms of Service
            </Link>
            <a
              href={COMPANY.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-[180ms] min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              LinkedIn
            </a>
            <a
              href={COMPANY.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-[180ms] min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              X
            </a>
            <a
              href={COMPANY.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-[180ms] min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              Instagram
            </a>
          </div>
          <p className="text-[11px] text-white/15">{COMPANY.address}</p>
        </div>
      </div>
    </footer>
  );
}
