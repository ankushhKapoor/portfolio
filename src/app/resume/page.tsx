"use client";

import { useEffect } from "react";

export default function ResumeRedirect() {

  useEffect(() => {
    // Use window.location.href for external redirects
    window.location.href = "https://resume-ankushhkapoor.vercel.app/pdf/ankush-kapoor-resume.pdf";
  }, []);

  return null; // No content to render
}
