const images = [
	"/img/gallery1.jpg",
	"/img/gallery2.jpg",
	"/img/gallery3.jpg",
	"/img/gallery4.jpg",
	"/img/gallery5.jpg",
	"/img/gallery6.jpg"
];
export default function GallerySection() {
	return (
		<section className="gallery">
			<h2>
				<b>Gallery</b> <span className="from">from</span> the past
				events
			</h2>
			<div className="content-container xlarge">
				{images.map((img) => (
					<div className="img-container transition ease-in-out delay-150 hover:transition-all">
						<img src={img} />
					</div>
				))}
				{images.map((img) => (
					<div className="img-container transition ease-in-out delay-150 hover:transition-all">
						<img src={img} />
					</div>
				))}
			</div>
		</section>
	);
}
