import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-moon-mist-100 text-rangitoto-950">
      <div className="container relative mx-auto min-h-screen w-full overflow-hidden">
        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-6 md:px-[120px] md:pt-[34px]">
          <Image
            src="/assets/brands/brand.svg"
            alt="1hudlabs"
            width={118}
            height={24}
            priority
          />

          <button
            type="button"
            className="flex h-10 w-[100px] items-center justify-center gap-2 rounded-full border border-rangitoto-950 text-sm font-normal text-rangitoto-950"
          >
            <span>Try now</span>
            <span aria-hidden>→</span>
          </button>
        </header>

        <div className="flex min-h-screen flex-col items-center justify-center">
          <section className="w-full px-6 md:px-[120px]">
            <p className="mb-1 text-2xl leading-8 font-normal text-rangitoto-950">
              Technology
            </p>

            <h1 className="font-heading text-[40px] leading-tight font-normal text-rangitoto-950 md:text-[64px] md:leading-[79px]">
              The fastest, most reliable way
            </h1>
          </section>

          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <div className="h-px w-full bg-rangitoto-950/10" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r from-moon-mist-100 to-transparent md:w-64" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-moon-mist-100 to-transparent md:w-64" />
          </div>

          <section className="flex w-full justify-end px-6 pt-4 md:px-[120px] md:pt-0">
            <h2 className="whitespace-nowrap text-right font-heading text-[40px] leading-tight font-normal text-rangitoto-950 md:text-[64px] md:leading-[79px]">
              to go from <span className="font-bold text-black font-satoshi">idea</span> to{" "}
              <span className="font-bold text-black font-satoshi">production</span>
            </h2>
          </section>
        </div>

        <aside className="absolute bottom-8 right-0 px-6 md:bottom-[34px] md:right-[120px] md:px-0">
          <p className="mb-2 w-[100px] font-satoshi text-[22px] font-normal leading-[30px] text-rangitoto-950">
            Trusted by
          </p>
          <div className="flex flex-wrap items-center justify-end gap-6 font-satoshi text-[18px] font-normal leading-[24px] text-black md:justify-end">
            <span className="before:mr-3 before:inline-block before:h-[16px] before:w-[6px] before:bg-black before:align-middle">
              Web3
            </span>
            <span className="before:mr-3 before:inline-block before:h-[16px] before:w-[6px] before:bg-black before:align-middle">
              artbase
            </span>
            <span className="before:mr-3 before:inline-block before:h-[16px] before:w-[6px] before:bg-black before:align-middle">
              dApps
            </span>
            <span className="before:mr-3 before:inline-block before:h-[16px] before:w-[6px] before:bg-black before:align-middle">
              Snipers
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}
