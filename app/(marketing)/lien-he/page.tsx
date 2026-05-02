export default function ContactPage() {
  return (
    <main className="shell section-gap">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Liên hệ</p>
          <h1 className="mt-4 font-display text-6xl text-ink">Liên hệ để nhận tư vấn nhanh và thông tin phù hợp</h1>
          <div className="mt-8 space-y-4 text-sm leading-8 text-steel">
            <p>Hotline: 0234235344</p>
            <p>Email: hello@whitespace.vn</p>
            <p>Văn phòng: Long Biên, Hà Nội</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-line bg-mist p-8">
          <h2 className="font-display text-4xl text-ink">Gửi yêu cầu tư vấn</h2>
          <form className="mt-6 grid gap-4">
            <input className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Họ và tên" />
            <input className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Số điện thoại" />
            <input className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Email" />
            <textarea className="min-h-36 rounded-[24px] border border-line px-5 py-4 text-sm outline-none" placeholder="Nhu cầu của bạn" />
            <button className="h-12 rounded-full bg-ink text-sm font-semibold text-white">Gửi thông tin</button>
          </form>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-[32px] border border-line">
        <iframe
          title="Office map"
          src="https://maps.google.com/maps?q=long%20bien%20ha%20noi&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="h-[420px] w-full"
          loading="lazy"
        />
      </div>
    </main>
  );
}
