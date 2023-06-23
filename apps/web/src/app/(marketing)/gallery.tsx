import Image from "next/image";

const images = [
  "/img/gallery1.jpg",
  "/img/gallery2.jpg",
  "/img/gallery3.jpg",
  "/img/gallery4.jpg",
  "/img/gallery5.jpg",
  "/img/gallery6.jpg",
];
export default function GallerySection() {
  return (
    <section className="gallery">
      <div className="landing-section-title">
        <b>Gallery</b> <span className="from">from</span> the past events
      </div>
      <div className="content-container xlarge">
        {images.map((img, i) => (
          <div key={`gallery-0${i}`} className="img-container relative">
            <Image
              className="object-cover object-center w-full h-full"
              fill
              src={img}
              alt={`gallery-0${i}`}
              quality={50}
            />
          </div>
        ))}
        {images.map((img, i) => (
          <div className="img-container w-full transition ease-in-out delay-150 hover:transition-all relative">
            <Image
              className="object-cover w-full h-full"
              fill
              src={img}
              alt={`gallery-1${i}`}
              quality={50}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
