import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
       <Hero
        title="Online Bursary Application System"
        subtitle="Apply, track, and manage bursary applications easily"
        image="https://media.istockphoto.com/id/505251781/photo/supreme-court-square-and-building-nairobi-kenya.webp?a=1&b=1&s=612x612&w=0&k=20&c=8GJGB9Zu5DfJSagrkf9z2CYaNV-vIe8fIYZLgLWMEXE="
      />
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-white shadow rounded">
          <h3 className="text-xl font-semibold mb-2">Easy Application</h3>
          <p className="text-gray-600">
            Submit your bursary application online with required documents.
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
          <p className="text-gray-600">
            Track your application status in real time.
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <h3 className="text-xl font-semibold mb-2">Fast Decisions</h3>
          <p className="text-gray-600">
            Administrators review and award bursaries efficiently.
          </p>
        </div>
      </section>

          <Footer />
    </>
  );
}
