'use client';
import { useState } from "react";
import Image from "next/image";
import logo from "@public/logo-icon.png";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { Twirl as Hamburger } from "hamburger-react"; 
import { createWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const account = useActiveAccount();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href.startsWith("/dashboard")) {
      return pathname.startsWith("/dashboard");
    }
    return pathname === href;
  };

  return (
    <nav className="bg-slate-100 border-b-2 border-slate-300 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Left Section - Logo & Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image 
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="drop-shadow-md cursor-pointer"
            />
          </Link>

          {/* Navigation Links (Hidden on Mobile) */}
          <ul className="hidden sm:flex gap-6">
            <li>
              <Link
                href="/"
                className={`text-sm font-semibold transition ${
                  isActive("/")
                    ? "text-green-600 hover:text-purple-700" 
                    : "text-gray-500 hover:text-purple-700"  
                }`}
              >
                Campaigns
              </Link>
            </li>
            {account && (
              <li>
                <Link
                  href={`/dashboard/${account.address}`}
                  className={`text-sm font-medium transition ${
                    isActive("/dashboard")
                      ? "text-green-600 hover:text-purple-700"
                      : "text-gray-700 hover:text-purple-700"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Section - Connect Wallet Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <Hamburger toggled={isOpen} toggle={setIsOpen} />
          </div>

          {/* Connect Wallet Button (Hidden on Mobile) */}
          <div className="hidden sm:block">
            <ConnectButton 
              client={client}
              wallets={[
                createWallet("io.metamask"),
                createWallet("com.coinbase.wallet"),
                createWallet("me.rainbow"),
              ]}
              chain={sepolia}
              theme={lightTheme()}
              detailsButton={{
                style: { maxHeight: "50px" }
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul className="sm:hidden mt-4 space-y-3 bg-white shadow-lg rounded-lg p-4 absolute z-50 right-4 top-16 w-[70%]">
          <li>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium transition ${
                isActive("/") ? "text-green-800" : "text-gray-700"
              } hover:text-purple-700`}
            >
              Campaigns
            </Link>
          </li>
          {account && (
            <li>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium transition ${
                  isActive("/dashboard") ? "text-green-800" : "text-gray-700"
                } hover:text-purple-700`}
              >
                Dashboard
              </Link>
            </li>
          )}
          {/* Connect Wallet Button (Shown in Mobile Menu) */}
          <li className="mt-3">
            <ConnectButton 
              client={client}
              theme={lightTheme()}
              detailsButton={{
                style: { maxHeight: "50px", width: "100%" }
              }}
            />
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
