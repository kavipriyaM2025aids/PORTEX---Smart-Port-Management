import React from 'react';
import { CheckCircle2, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

const Badge = ({ status, variant }) => {
  if (!status) return null;

  const text = String(status).toUpperCase();

  // Green / Cleared / Paid / Active / Confirmed
  if (
    variant === 'success' ||
    ['ACTIVE', 'CLEARED', 'SUCCESS', 'PAID', 'APPROVED', 'CONFIRMED', 'VALID', 'COMPLIANT', 'BALANCED'].includes(text)
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eafaf1] text-[#1e8a4a] ring-1 ring-[#c2edd3] shadow-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8a4a]" />
        <span>{text === 'PAID' ? 'Paid' : text.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  // Orange / Pending / Issued / Draft
  if (
    variant === 'warning' ||
    ['PENDING', 'DRAFT', 'ISSUED', 'POSTED', 'MAINTENANCE'].includes(text)
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff8eb] text-[#d97706] ring-1 ring-[#fed7aa] shadow-xs">
        <Clock className="w-3.5 h-3.5 text-[#d97706]" />
        <span>{text === 'PENDING' || text === 'ISSUED' ? 'Pending' : text.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  // Cyan / Blue / Processing / In Progress / Partial
  if (
    ['PROCESSING', 'IN_PROGRESS', 'IN PROGRESS', 'PARTIALLY_PAID', 'PARTIAL'].includes(text)
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f0f9ff] text-[#0284c7] ring-1 ring-[#bae6fd] shadow-xs">
        <RefreshCw className="w-3.5 h-3.5 text-[#0284c7]" />
        <span>Processing</span>
      </span>
    );
  }

  // Rose / Red / Overweight / Rejected / Failed
  if (
    variant === 'danger' ||
    variant === 'error' ||
    ['OVERWEIGHT', 'REJECTED', 'FAILED', 'INACTIVE', 'CANCELLED', 'UNBALANCED'].includes(text)
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff1f2] text-[#e11d48] ring-1 ring-[#fecdd3] shadow-xs">
        <AlertTriangle className="w-3.5 h-3.5 text-[#e11d48]" />
        <span>{text.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  // Lavender / Purple / Info Master items
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f5f3ff] text-[#7c3aed] ring-1 ring-[#ddd6fe]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
      <span>{text.replace(/_/g, ' ')}</span>
    </span>
  );
};

export default Badge;