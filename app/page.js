import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import NavBar from "./_components/NavBar";
import RecommendationForm from "./_components/RecommandationForm";

export default function Home() {
  return (
    <div>
      <NavBar/>
      <main className="pt-16">
        <Hero/>
        <RecommendationForm/>
      </main>

     <Footer/>
    </div>
  );
}
