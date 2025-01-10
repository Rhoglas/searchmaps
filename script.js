document
  .getElementById("imageInput")
  .addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      EXIF.getData(file, function () {
        const lat = EXIF.getTag(this, "GPSLatitude");
        const lng = EXIF.getTag(this, "GPSLongitude");
        const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
        const lngRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

        if (lat && lng) {
          const latitude = convertToDecimal(lat, latRef);
          const longitude = convertToDecimal(lng, lngRef);
          const coordinates = `Coordenadas: ${latitude}, ${longitude}`;
          const coordinatesCopy = `${latitude}, ${longitude}`;
          document.getElementById("info").textContent = coordinates;

          // Atualiza o link para Google Maps
          const googleMapsLink = document.getElementById("googleMapsLink");
          googleMapsLink.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
          googleMapsLink.style.display = "inline-block";

          // Exibe o botão de cópia
          const copyButton = document.getElementById("copyButton");
          copyButton.style.display = "inline-block";
          copyButton.onclick = () => copyToClipboard(coordinatesCopy);
        } else {
          document.getElementById("info").textContent =
            "Não foi possível encontrar coordenadas GPS na imagem.";
          document.getElementById("copyButton").style.display = "none";
          document.getElementById("googleMapsLink").style.display = "none";
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }
}

function convertToDecimal(coord, ref) {
  const degrees = coord[0].numerator / coord[0].denominator;
  const minutes = coord[1].numerator / coord[1].denominator;
  const seconds = coord[2].numerator / coord[2].denominator;
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (ref === "S" || ref === "W") {
    decimal *= -1;
  }
  return decimal;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => alert("Coordenadas copiadas para a área de transferência!"),
    (err) => alert("Erro ao copiar coordenadas: " + err)
  );
}

// input

const avatarInput = document.querySelector("#imageInput");
const avatarName = document.querySelector(".input-file__name");
const imagePreview = document.querySelector(".image-preview");

avatarInput.addEventListener("change", (e) => {
  let input = e.currentTarget;
  let fileName = input.files[0].name;
  avatarName.innerText = `File: ${fileName}`;

  const fileReader = new FileReader();
  fileReader.addEventListener("load", (e) => {
    let imageData = e.target.result;
    imagePreview.setAttribute("src", imageData);
  });

  fileReader.readAsDataURL(input.files[0]);
});
