import Image from "next/image";
import Link from "next/link";

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
          <span className="text-sm font-semibold text-sand">{project.price}</span>
        </div>
        <div>
          <h3 className="font-display text-3xl text-ink">{project.name}</h3>
          <p className="mt-2 text-sm leading-7 text-steel">{project.address}</p>
        </div>
        <p className="text-sm leading-7 text-steel">{project.description}</p>
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
