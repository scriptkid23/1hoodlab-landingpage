"use client";

import Image from "next/image";
import { Button, NextUIProvider } from "@nextui-org/react";
import SocialLink from "./components/SocialLink";
import CircleAnim from "./components/CircleAnim";
import OvalAnim from "./components/OvalAnim";

export default function Home() {
  return (
    <NextUIProvider className="h-full">
      <div className="font-polySans flex flex-col h-full">
        <div className="bg-black-950">
          <div className="flex px-[42px] py-[20px] items-center justify-between">
            <div>
              <Image
                src="/assets/icons/brand.svg"
                alt="brand"
                width={20}
                height={20}
              />
            </div>
            <div className="flex items-center gap-[35px]">
              <a>Projects</a>
              <a>About us</a>
              <div>
                <Button className="bg-blue-700 text-white-50 rounded-[3px]">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 flex-1">
          <div className="col-span-3 flex flex-col h-full">
            <div className="bg-black-950 px-[42px] pt-[54px] pb-[121px]">
              <div>
                <p className="font-polySans text-[24px] font-bold max-w-[210px]">
                  Productive Free and Easy new.
                </p>
                <span className="text-[16px] text-black-300">1hoodlab</span>
              </div>
            </div>
            <div className="bg-black-50 flex-grow py-[55px] px-[42px] flex flex-col justify-between">
              <div>
                <div>
                  <h2 className="text-[48px] font-medium text-black-950 leading-10 mb-[2px]">
                    SHARKS
                  </h2>
                  <span className="uppercase text-black-950 font-medium text-[12px] font-inter">
                    project
                  </span>
                </div>
                <div className="mb-[17px] mt-[26px]">
                  <p className="text-black-950">
                    A thrilling Telegram game with over 1M users! Dive in to
                    play, complete missions, and refer friends for rewards. Join
                    the frenzy and dominate the leaderboard!
                  </p>
                </div>

                <Button className="bg-black-950 uppercase text-white font-inter rounded-[3px] text-[14px] font-semibold">
                  join now
                </Button>
              </div>

              <div className="flex gap-2">
                <SocialLink
                  altText="social"
                  href="#"
                  iconSrc="/assets/icons/telegram.svg"
                />
                <SocialLink
                  altText="social"
                  href="#"
                  iconSrc="/assets/icons/twitter.svg"
                />
                <SocialLink
                  altText="social"
                  href="#"
                  iconSrc="/assets/icons/github.svg"
                />
              </div>
            </div>
          </div>
          <div className="col-span-9">
            <div className="bg-white flex relative h-full w-full">
              {/* Wrapper cho CircleAnim và OvalAnim */}
              <div className="relative flex items-center justify-start">
                {/* CircleAnim */}
                <div className="absolute">
                  <CircleAnim />
                </div>

                {/* OvalAnim */}
                <div className="absolute translate-x-[54px]">
                  <OvalAnim />
                </div>
                <div className="absolute w-[462px] translate-x-[95%]">
                  <div className="text-black-950 font-polySans font-extrabold text-[48px] uppercase">
                    <p>1hoodlab.</p>
                    <p>next innovation</p>
                  </div>
                  <div className="text-black-950 font-polySans font-medium text-[14px] flex justify-end">
                    <p className="max-w-[288px]">
                      at 1HOODLAB, we are at the forefront of transforming
                      digital experiences by leveraging blockchain, GameFi, and
                      Web3 technologies. Our mission is to build a decentralized
                      future that empowers communities, creators, and gamers
                      worldwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chữ "new" ở góc dưới bên trái */}
              <div className="absolute bottom-0 left-0 text-black-950 font-polySans font-semibold text-[48px] p-2 uppercase ml-[6%] mb-[33px]">
                new.
              </div>
            </div>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
}
