// Application Constants

// Toast & Alert Configuration
export const TOAST_DURATION = 3000; // 3 seconds
export const ERROR_DISPLAY_DURATION = 5000; // 5 seconds
export const SUCCESS_REDIRECT_DELAY = 1500; // 1.5 seconds
export const PROFILE_SAVE_DELAY = 500; // 0.5 seconds

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  MEDIUM: 300,
  SLOW: 500,
} as const;

// Animation Delays
export const ANIMATION_DELAY = {
  STAGGER: 50, // For staggered animations
  ITEM: 100,   // For individual items
  FOOTER: 400, // For footer elements
} as const;

// UI Sizing Constants
export const UI_SIZES = {
  TOAST_MIN_WIDTH: 300,
  TOAST_MAX_WIDTH: 400,
  MODAL_TEXT_PREVIEW_LENGTH: 200,
  MODAL_LINE_PREVIEW_LIMIT: 5,
  HOVER_BUTTON_WIDTH: 85,
  TITLE_TRUNCATE_LENGTH: 100,
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_ITEMS_PER_PAGE: 10,
  ITEMS_PER_PAGE_OPTIONS: [5, 10, 20, 50],
  MAX_VISIBLE_PAGES: 5,
} as const;

// Form Validation
export const VALIDATION = {
  MIN_QUESTION_LENGTH: 10,
  MAX_QUESTION_LENGTH: 1000,
  MIN_OPTION_LENGTH: 1,
  MAX_OPTION_LENGTH: 500,
  MIN_SUBJECT_LENGTH: 2,
  MAX_SUBJECT_LENGTH: 100,
} as const;

// Grade Distribution (for dashboard display)
export const GRADE_RANGES = {
  A: { min: 90, max: 100, label: 'A (90-100%)' },
  B: { min: 80, max: 89, label: 'B (80-89%)' },
  C: { min: 70, max: 79, label: 'C (70-79%)' },
  D: { min: 60, max: 69, label: 'D (60-69%)' },
  F: { min: 0, max: 59, label: 'F (0-59%)' },
} as const;

// API Configuration
export const API_CONFIG = {
  REQUEST_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Security
export const SECURITY = {
  TOKEN_REFRESH_THRESHOLD: 300000, // 5 minutes before expiry
  COOKIE_MAX_AGE: 86400, // 24 hours
} as const;