import Image from "next/image"
import Link from "next/link"
import { NAVBAR_HEIGHT } from "@/lib/constants"
import { Button } from "./ui/button"

const Navbar = () => {
  return (
    <div
      className="fixed w-full z-50 top-0 left-0 shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex w-full justify-between items-center py-3 px-8 bg-primary-700 text-white">
        <div className="flex  w-full justify-between items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="cursor-pointer hover:!text-primary-300"
            scroll={false}
          >
            <div className="flex justify-center items-center font-semibold">
              <Image src="/logo.svg" width={12} height={12} alt="logo" />
              <span className="pl-2">RENTI</span>
              <span className="text-secondary-500 font-light hover:!text-primary-300">
                FUL
              </span>
            </div>
          </Link>
          <p className="text-primary-200 hidden md:block">
            Discover the best place to live with one click
          </p>
          <div className="flex justify-center items-center gap-2">
            <Link href="/signin">
              <Button
                variant="outline"
                className="text-white border-white bg-transparent  hover:bg-white hover:text-primary-700 rounded-lg"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="secondary"
                className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
