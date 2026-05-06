import Image from "next/image";
import Link from "next/link";

import { HtmlContent } from "@/components/shared/html-content";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="content-lift group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white transition duration-500 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="relative h-56 overflow-hidden">
        <Image src={project.thumbnail} alt={project.name} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(8,18,37,0.18)_100%)] opacity-80" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy">
            {project.area}
          </span>
          <div className="rounded-xl bg-[linear-gradient(135deg,#fff5e1,#ffebbb)] px-3 py-2 text-right shadow-[0_10px_20px_rgba(191,138,38,0.12)] ring-1 ring-[#ecd39c]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">Giá bán</p>
            <p className="mt-1 text-lg font-black leading-none text-[#8b5a16]">{project.price}</p>
          </div>
        </div>
        <div className="space-y-0">
          <h3 className="min-h-[3.5rem] font-display text-3xl leading-tight text-ink">{project.name}</h3>
          <p className="min-h-[1rem] text-sm leading-4 text-steel">{project.address}</p>
        </div>
        <p className="text-sm font-medium text-navy">{project.cardMeta}</p>
        <div className="min-h-[5.5rem] overflow-hidden">
          <HtmlContent
            html={project.description}
            className="prose prose-sm max-w-none overflow-hidden text-steel prose-p:my-0 prose-p:leading-6 prose-li:leading-6 prose-strong:text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
          />
        </div>
        <Link
          href={`/du-an/${project.slug}`}
          className="mt-auto inline-flex self-start rounded-full border border-[#0066cc] px-5 py-3 text-sm font-medium tracking-[-0.224px] text-[#0066cc] transition hover:bg-[#0066cc] hover:text-white"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
