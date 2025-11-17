import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto mt-4 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">ACENDA</h3>
            <p className="text-sm">
              Your trusted partner in discovering the world's most beautiful
              destinations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm  pl-0 list-none">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  News
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm  pl-0 list-none">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  Safety information
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  Terms of service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition no-underline"
                >
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@acenda.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>www.acenda.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-2 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mt-4 md:mt-0">&copy; 2025 Acenda. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
