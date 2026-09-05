// Exact design system tokens and helper classes as specified in prompt
export const colors = {
  brand: {
    bg: '#F8F6F1',        // warm off-white — page/sidebar bg
    sidebar: '#F8F6F1',
    primary: '#6B705C',   // olive green — buttons, active nav, accents
    secondary: '#A5A58D', // muted olive/tan — secondary text, borders
    card: '#FFFFFF',      // card backgrounds
    text: '#2C2C2C',      // dark charcoal — headings
    muted: '#737373',     // muted gray — secondary text
    border: '#E5E3DC',    // subtle warm border
    success: '#3D7A4E',   // green — Paid, Confirmed
    danger: '#C0392B',    // red — Unpaid, Danger
    warning: '#D97706',   // amber — Draft
    hover: '#5C6149',     // darker olive — button hover
  }
};

export const ui = {
  // Layout
  page: 'min-h-screen bg-[#F8F6F1] font-body text-[#2C2C2C]',
  card: 'bg-white rounded-xl border border-[#E5E3DC] shadow-sm p-6',
  sidebar: 'bg-[#F8F6F1] border-r border-[#E5E3DC]',

  // Buttons
  btnPrimary: 'bg-[#6B705C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#5C6149] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50',
  btnSecondary: 'bg-white border border-[#E5E3DC] text-[#2C2C2C] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F8F6F1] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50',
  btnDanger: 'bg-[#C0392B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A32F23] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50',

  // Form inputs
  input: 'w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 focus:border-[#6B705C] text-[#2C2C2C] placeholder:text-[#A0A0A0]',
  label: 'text-sm font-medium text-[#2C2C2C] mb-1 block',
  select: 'w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6B705C]/30 focus:border-[#6B705C] text-[#2C2C2C]',

  // Table
  table: 'w-full text-sm border-collapse',
  th: 'text-left px-4 py-3 text-[#737373] font-medium border-b border-[#E5E3DC] bg-[#F8F6F1]',
  td: 'px-4 py-3 border-b border-[#E5E3DC] text-[#2C2C2C]',
  trHover: 'hover:bg-[#F8F6F1]/60 transition-colors cursor-pointer',

  // Status badges
  badgePaid: 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
  badgeUnpaid: 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
  badgeDraft: 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800',
  badgeConfirmed: 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',

  // Nav
  navItem: 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#737373] hover:bg-[#6B705C]/10 hover:text-[#6B705C] transition-colors cursor-pointer',
  navActive: 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-[#6B705C] text-white font-medium',

  // Section headers
  pageTitle: 'text-xl font-semibold text-[#2C2C2C] font-display',
  sectionLabel: 'text-xs font-semibold uppercase tracking-widest text-[#A5A58D] mb-2',

  // Metric cards (dashboard)
  metricCard: 'bg-white rounded-xl border border-[#E5E3DC] p-5 flex flex-col gap-1 shadow-sm',
  metricValue: 'text-2xl font-semibold text-[#2C2C2C] font-mono',
  metricLabel: 'text-xs text-[#737373]',
};
