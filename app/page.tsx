import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import About from "@/components/About";
import Philosophy from "@/components/Philosophy";
import HowWeServe from "@/components/HowWeServe";
import TailoredConcepts from "@/components/TailoredConcepts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <About />
        <Philosophy />
        <HowWeServe />
        <TailoredConcepts />
      </main>
      <Footer />
    </>
  );
}
