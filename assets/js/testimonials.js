function fetchTestimonials() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.npoint.io/3304bb0a8973398d09f3", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.testimonials);
      } else {
        reject("Error :", xhr.status);
      }
    };
    xhr.onerror = () => reject("network error");

    xhr.send();
  });
}

const testimonialsContainer = document.getElementById("testimonialsContainer");

const testimonialsHTML = (array) => {
  return array
    .map(
      (testimonials) => `
          <article>
            <img src="assets/uploads/${testimonials.image}" alt="testimonial-image" />
            <p class="testimonial-item-caption">"${testimonials.message}"</p>
            <p style="text-align: right">- ${testimonials.name}</p>
            <p style="text-align: right; font-weight: bold">${testimonials.rating}★</p>
          </article>
          `
    )
    .join("");
};

async function showAllTestimonials() {
  const testimonials = await fetchTestimonials();
  console.log(testimonials);
  testimonialsContainer.innerHTML = testimonialsHTML(testimonials);
}

showAllTestimonials();

async function filterTestimonialsByStar(rating) {
  const testimonials = await fetchTestimonials();

  const filteredTestimonials = testimonials.filter(
    (testimonial) => testimonial.rating === rating
  );

  console.log(filteredTestimonials);

  if (filteredTestimonials.length === 0) {
    return (testimonialsContainer.innerHTML = `<p>No testimonials.</p>`);
  }

  testimonialsContainer.innerHTML = testimonialsHTML(filteredTestimonials);
}

// export const testimonials = [
//   { name: "John Doe", rating: 5, message: "Luar biasa!", image: "user1.jpg" },
//   {
//     name: "Jane Smith",
//     rating: 4,
//     message: "Sangat bagus!",
//     image: "user2.jpg",
//   },
//   { name: "Alice Johnson", rating: 3, message: "Lumayan", image: "user3.jpg" },
//   {
//     name: "Bob Brown",
//     rating: 5,
//     message: "Rekomendasi banget!",
//     image: "user4.jpg",
//   },
//   {
//     name: "Charlie White",
//     rating: 2,
//     message: "Bisa lebih baik",
//     image: "user5.jpg",
//   },
// ];

// // Fungsi untuk mendapatkan testimonials berdasarkan rating
// function getTestimonials(rating = "") {
//   const filteredTestimonials = rating
//     ? testimonials.filter((t) => t.rating === parseInt(rating))
//     : testimonials;

//   return filteredTestimonials;
// }

// // Jika digunakan di server
// if (typeof module !== "undefined") {
//   module.exports = { testimonials, getTestimonials };
// }

// // Jika digunakan di browser
// document.addEventListener("DOMContentLoaded", function () {
//   const testimonialContainer = document.getElementById("testimonial-container");
//   const ratingFilter = document.getElementById("rating");

//   function fetchTestimonials(filter = "") {
//     const data = getTestimonials(filter); // Ambil data dari fungsi

//     testimonialContainer.innerHTML = "";
//     if (data.length === 0) {
//       testimonialContainer.innerHTML =
//         "<p class='text-center'>Tidak ada testimoni yang sesuai.</p>";
//       return;
//     }

//     data.forEach((testimonial) => {
//       const stars = "⭐".repeat(testimonial.rating);
//       const testimonialHTML = `
//         <div class="col-md-4">
//           <div class="card mb-4">
//             <img src="/uploads/${testimonial.image}" class="card-img-top" alt="Foto Testimoni">
//             <div class="card-body">
//               <h5 class="card-title">${testimonial.name}</h5>
//               <p class="text-warning">${stars}</p>
//               <p class="card-text">"${testimonial.message}"</p>
//             </div>
//           </div>
//         </div>
//       `;
//       testimonialContainer.innerHTML += testimonialHTML;
//     });
//   }

//   // Ambil data pertama kali
//   fetchTestimonials();

//   // Event listener untuk filter rating
//   ratingFilter.addEventListener("change", function () {
//     fetchTestimonials(this.value);
//   });
// });
