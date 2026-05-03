import Image from "next/image";
import Link from "next/link";

import { HtmlContent } from "@/components/shared/html-content";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
      <div className="relative h-64">
        <Image src={project.thumbnail} alt={project.name} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-6">
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
          <h3 className="font-display text-3xl text-ink">{project.name}</h3>
          <p className="mt-2 text-sm leading-7 text-steel">{project.address}</p>
        </div>
        <HtmlContent
          html={project.description}
          className="prose prose-sm max-w-none overflow-hidden text-steel prose-p:my-0 prose-p:leading-7 prose-li:leading-7 prose-strong:text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
        />
        <Link
          href={`/du-an/${project.slug}`}
          className="inline-flex rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}
