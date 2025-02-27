const dummyTestimonials = [
  {
    author: "Rafli Kurniawan",
    rating: 5,
    caption: "Sangat membantu dan bermanfaat!",
    image: "https://via.placeholder.com/150",
  },
  {
    author: "Dewi Anggraini",
    rating: 4,
    caption: "Pelayanan sangat baik dan responsif.",
    image: "https://via.placeholder.com/150",
  },
  {
    author: "Budi Santoso",
    rating: 3,
    caption: "Cukup memuaskan, tetapi bisa lebih baik lagi.",
    image: "https://via.placeholder.com/150",
  },
  {
    author: "Siti Nurhaliza",
    rating: 5,
    caption: "Luar biasa! Tidak mengecewakan.",
    image: "https://via.placeholder.com/150",
  },
  {
    author: "Andi Pratama",
    rating: 2,
    caption: "Kurang memuaskan, perlu perbaikan lebih lanjut.",
    image: "https://via.placeholder.com/150",
  },
];

async function fetchTestimonial() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyTestimonials), 500);
  });
}

const testimonialsContainer = document.getElementById("testimonial-list");

function testimonialsHTML(array) {
  return array
    .map(
      (testimonial) => `
          <article class="col-md-6 mb-3">
            <div class="card p-3 border rounded">
              <img src="${
                testimonial.image
              }" class="img-fluid" alt="testimonial-image" />
              <p class="testimonial-item-caption pt-3"><i>"${
                testimonial.caption
              }"</i></p>
              <p class="text-end">- ${testimonial.author}</p>
              <p class="text-end" style="font-weight: bold">
                ${Array(testimonial.rating).fill("⭐").join(" ")} (${
        testimonial.rating
      }/5)
              </p>
            </div>
          </article>
        `
    )
    .join("");
}

async function showAllTestimonials() {
  const testimonials = await fetchTestimonial();
  testimonialsContainer.innerHTML = testimonialsHTML(testimonials);
}

async function filterTestimonialsByStar(rating) {
  const testimonials = await fetchTestimonial();
  const filteredTestimonials = testimonials.filter(
    (testimonial) => testimonial.rating === rating
  );

  if (filteredTestimonials.length === 0) {
    testimonialsContainer.innerHTML = `<p class="text-center text-muted">No testimonial</p>`;
  } else {
    testimonialsContainer.innerHTML = testimonialsHTML(filteredTestimonials);
  }
}

document.addEventListener("DOMContentLoaded", showAllTestimonials);
