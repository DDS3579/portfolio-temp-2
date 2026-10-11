import { FILL, type Maybe } from "./fill";

/** Flip to true only once real quotes are filled in below. */
export const SHOW_TESTIMONIALS = false;

export interface Testimonial {
  quote: Maybe;
  name: Maybe;
  role: Maybe;
}

export const testimonialsCopy = { title: "What people say" };
export const testimonials: Testimonial[] = [
  { quote: FILL, name: FILL, role: FILL },
  { quote: FILL, name: FILL, role: FILL },
  { quote: FILL, name: FILL, role: FILL },
];
