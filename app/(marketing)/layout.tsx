import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { FloatingContact } from "@/components/shared/floating-contact";

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <FloatingContact />
      <Footer />
    </>
  );
}
