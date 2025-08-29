import ApartmentList from "../../components/dashboard/ApartmentList";
import Navigation from "../../components/dashboard/Navigation";

export default function FavoritesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Heading */}
      <header className="px-[21px] pt-4 pb-[20px]">
        <h1 className="text-[24px] font-medium text-[#0D1321]">Favorites</h1>
        <p className="text-[#666666] text-[14px]">
          You have a good taste of soft life 
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <ApartmentList />
      </main>

      {/* Bottom navigation */}
      <footer className="sticky bottom-0">
        <Navigation />
      </footer>
    </div>
  );
}
