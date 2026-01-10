interface Country {
  id: string;
  name: string;
  imageUrl: string;
}

const countries: Country[] = [
  {
    id: "dubai",
    name: "Dubai",
    imageUrl: "/countries/dubai.jpg",
  },
  {
    id: "bali",
    name: "Bali",
    imageUrl: "/countries/bali.jpg",
  },
  {
    id: "france",
    name: "France",
    imageUrl: "/countries/france.jpg",
  },
  {
    id: "japan",
    name: "Japan",
    imageUrl: "/countries/japan.jpg",
  },
  {
    id: "switzerland",
    name: "Switzerland",
    imageUrl: "/countries/switzerland.jpg",
  },
];

export default function CountriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Best Cities to Visit
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          {countries.map((country) => (
            <div
              key={country.id}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer h-64 md:h-72"
            >
              <img
                src={country.imageUrl}
                alt={country.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                <h3 className="text-white text-xl md:text-2xl font-bold p-4 md:p-6 w-full">
                  {country.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
            View All Countries
          </button>
        </div>
      </div>
    </section>
  );
}
