function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto text-center space-y-3 px-4">
        <p className="text-sm sm:text-base">
          &copy; 2025 <span className="font-semibold text-white">Dynamic Form Generator</span>. All rights reserved.
        </p>
        <p className="text-sm">
          📧 support@dfg.com | 📞 +91 12345 67890
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-pink-400 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-300 transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
