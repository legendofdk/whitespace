import Image from "next/image";
import Link from "next/link";

import { HtmlContent } from "@/components/shared/html-content";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="content-lift group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-soft transition duration-500 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <div className="relative h-56">
        <Image src={project.thumbnail} alt={project.name} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy">
            {project.area}
          </span>
          <div className="rounded-xl bg-[linear-gradient(135deg,#fff3d6,#ffe7ad)] px-3 py-2 text-right shadow-[0_10px_20px_rgba(191,138,38,0.16)] ring-1 ring-[#e7c06d]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">Giá bán</p>
            <p className="mt-1 text-lg font-black leading-none text-[#8b5a16]">{project.price}</p>
          </div>
        </div>
        <div>
          <h3 className="min-h-[3.25rem] font-display text-3xl leading-tight text-ink">{project.name}</h3>
          <p className="mt-1 min-h-[2rem] text-sm leading-6 text-steel">{project.address}</p>
        </div>
        <div className="min-h-[6rem] overflow-hidden">
          <HtmlContent
            html={project.description}
            className="prose prose-sm max-w-none overflow-hidden text-steel prose-p:my-0 prose-p:leading-6 prose-li:leading-6 prose-strong:text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
          />
        </div>
        <Link
          href={`/du-an/${project.slug}`}
          className="mt-auto inline-flex self-start rounded-full border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
