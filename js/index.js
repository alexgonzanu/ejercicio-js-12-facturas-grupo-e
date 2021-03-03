const urlApi = "http://localhost:3001/facturas";

const recogerDatosApi = async () => {
  const responsive = await fetch(urlApi);
  const datos = await responsive.json();
  console.log(datos);
};

recogerDatosApi();
