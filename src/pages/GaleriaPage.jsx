import ImageCarousel from "../components/ImageCarousel";

function GaleriaPage() {
  return (
    <main className="container-fluid page-galeria">
      <h1>Galeria</h1>
      <p className="lead">
        Explore as imagens do universo de O Castelo das Marias.
      </p>
      <ImageCarousel />
    </main>
  );
}

export default GaleriaPage;
