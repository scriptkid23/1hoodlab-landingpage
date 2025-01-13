"use client";

import Image from "next/image";
import { Button, NextUIProvider } from "@nextui-org/react";
import SocialLink from "./components/SocialLink";
import CombinedAnim from "./components/GroupAnim";
import UpDownPoint from "./components/UpDownPoint";

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
          <div className="col-span-9 flex flex-col">
            <div className="flex">
              <div className="relative inline-flex items-center justify-end ">
                <CombinedAnim />

                <div className="absolute w-[462px]  inline-flex flex-col translate-x-[45%] z-10">
                  <div className="text-black-950 font-polySans font-extrabold text-[48px] uppercase z-10">
                    <p className="mix-blend-difference">1hoodlab.</p>
                    <p className="mix-blend-difference">next innovation</p>
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
              <div className="flex-grow inline-flex justify-end p-14">
                <div>
                  <img src="/assets/images/ellipse.svg" alt="image" />
                </div>
              </div>
            </div>
            <div className="px-20 flex justify-between relative">
              <p className="text-[48px] font-polySans font-extrabold uppercase text-black-950">
                new.
              </p>
              <div className="flex w-[500px]">
                <div className="relative w-[16.5rem] bottom-[60px]">
                  <img
                    src="/assets/images/ellipse1.svg"
                    className="absolute inset-1"
                  />
                </div>
                <div className="absolute right-[15%]">
                  <UpDownPoint size={50} color="#000000" />
                </div>
                <div className=" absolute right-[5%] bottom-[30%]">
                  <UpDownPoint
                    size={20}
                    color="#000000"
                    distance={10}
                    duration={0.8}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
}
