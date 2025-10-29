import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

const FooterSection = () => {
  return (
    <div className="flex flex-col items-center mx-auto py-12 gap-4">
      <Link href="/" className="text-xl text-primary-800 font-bold">
        BASECLUB
      </Link>
      <div>
        <nav>
          <ul className="flex justify-between gap-6 font-semibold">
            <li>
              <Link href="/about">About us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex justify-between gap-6">
        <a
          href="/#"
          aria-label="Facebook"
          title="Facebook"
          className="hover:text-primary-600"
        >
          <FontAwesomeIcon icon={faFacebook} className=" h-6 w-6" />
        </a>
        <a
          href="/#"
          aria-label="Twitter"
          title="Twitter"
          className="hover:text-primary-600"
        >
          <FontAwesomeIcon icon={faTwitter} className=" h-6 w-6" />
        </a>
        <a
          href="/#"
          aria-label="Youtube"
          title="Youtube"
          className="hover:text-primary-600"
        >
          <FontAwesomeIcon icon={faYoutube} className=" h-6 w-6" />
        </a>
        <a
          href="/#"
          aria-label="Linkedin"
          title="Linkedin"
          className="hover:text-primary-600"
        >
          <FontAwesomeIcon icon={faLinkedin} className=" h-6 w-6" />
        </a>
        <a
          href="/#"
          aria-label="Instagram"
          title="Instagram"
          className="hover:text-primary-600"
        >
          <FontAwesomeIcon icon={faInstagram} className=" h-6 w-6" />
        </a>
      </div>
      <div className="flex justify-center text-center space-x-4 mt-8 text-sm text-gray-500 border-t border-gray-300 py-6 w-11/12 ">
        <span>© RENTIFUL. All rights reserved.</span>
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>
        <Link href="/cookies" className="underline">
          Cookie Policy
        </Link>
      </div>
    </div>
  )
}

export default FooterSection
