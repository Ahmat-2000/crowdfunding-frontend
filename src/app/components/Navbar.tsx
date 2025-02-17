'use client';
import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { client } from "../client";

const Navbar = () => {
  const account = useActiveAccount();

  return (
    <nav className="flex items-center justify-between p-3 bg-slate-100 border-b-2 border-slate-300">
      
      {/* Left Section - Logo & Navigation Links */}
      <div className="flex items-center gap-10">
        <Image 
          src={thirdwebIcon}
          alt="Logo"
          width={32}
          height={32}
          className="drop-shadow-md"
        />

        <ul className="flex gap-5">
          <li>
            <Link className="text-sm font-medium hover:text-purple-700" href="/">
              Campaigns
            </Link>
          </li>

          {account && (
            <li>
              <Link className="text-sm font-medium hover:text-purple-700" href="/dashboard">
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Right Section - Connect Button */}
      <div>
        <ConnectButton 
          client={client}
          theme={lightTheme()}
          detailsButton={{
            style: {
              maxHeight: "50px",
            }
          }}
        />
      </div>
    </nav>
  );
}

export default Navbar;
