"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResumeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Use window.location.href for external redirects
    window.location.href = "https://resume-ankushhkapoor.vercel.app/pdf/ankush-kapoor-resume.pdf";
  }, []);

  return null; // No content to render
}
