"use client";

const Footer = () => {
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div className="bg-dark-900/90 backdrop-blur-sm text-sm text-muted-foreground rounded-full px-4 py-2 flex items-center gap-3 shadow-lg border border-dark-700">
        <span className="font-medium">Developed by Aditya Kumar</span>
        <a
          href="https://www.linkedin.com/in/Aditya Kumar-singh-frontend-developer/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Aditya Kumar on LinkedIn"
          className="hover:text-primary-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="opacity-90"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11.75 20h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75c.966 0 1.75.785 1.75 1.75s-.784 1.75-1.75 1.75zm13.25 12.268h-3v-5.5c0-1.319-.026-3.016-1.836-3.016-1.836 0-2.118 1.434-2.118 2.918v5.598h-3v-11h2.881v1.504h.041c.401-.758 1.379-1.558 2.838-1.558 3.036 0 3.598 1.999 3.598 4.596v6.458z" />
          </svg>
        </a>
        <a
          href="https://github.com/adityakarn47"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Aditya Kumar on GitHub"
          className="hover:text-primary-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="opacity-90"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.236 1.839 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.76-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.235-3.221-.123-.303-.536-1.526.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.65.242 2.873.119 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.806 5.624-5.479 5.921.43.371.814 1.102.814 2.222 0 1.606-.014 2.902-.014 3.293 0 .319.218.694.825.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Footer;
